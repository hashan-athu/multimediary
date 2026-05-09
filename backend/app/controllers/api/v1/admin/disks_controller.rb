# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DisksController < BaseController
        before_action :set_disk, only: [ :show, :update, :destroy ]
        before_action :check_movies_before_destroy, only: [ :destroy ]
        load_and_authorize_resource class: Disk

        def index
          @disks = Disk.includes(:disk_format)
          @disks = apply_sort(@disks, default_column: :name, default_direction: :asc)
          @disks = paginate(@disks)

          render_success({
            disks: DiskSerializer.render_as_hash(@disks, view: :compact),
            meta: pagination_meta(@disks)
          })
        end

        def show
          render_success({ disk: DiskSerializer.render_as_hash(@disk, view: :detail) })
        end

        def create
          @disk = Disk.new(disk_params)
          @disk.save!
          render_success({ disk: DiskSerializer.render_as_hash(@disk, view: :compact) }, status: :created)
        end

        def update
          @disk.update!(disk_params)
          render_success({ disk: DiskSerializer.render_as_hash(@disk, view: :compact) })
        end

        def destroy
          @disk.destroy!
          render json: { message: "Disk deleted successfully" }, status: :ok
        end

        private

        def set_disk
          @disk = Disk.includes(:disk_format, movies: [ :category, :genres, :qualities ]).find(params[:id])
        end

        def disk_params
          params.require(:disk).permit(:name, :storage_type, :disk_format_id)
        end

        def check_movies_before_destroy
          if @disk.movies.exists?
            render json: { error: "Cannot delete disk with associated movies" }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
