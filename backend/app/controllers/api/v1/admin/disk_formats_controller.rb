# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DiskFormatsController < BaseController
        before_action :set_disk_format, only: [ :show, :update, :destroy ]
        before_action :check_disks_before_destroy, only: [ :destroy ]
        load_and_authorize_resource class: DiskFormat

        def index
          @disk_formats = DiskFormat.order(name: :asc)
          @disk_formats = paginate(@disk_formats)

          render_success({
            disk_formats: DiskFormatSerializer.render_as_hash(@disk_formats),
            meta: pagination_meta(@disk_formats)
          })
        end

        def show
          render_success({ disk_format: DiskFormatSerializer.render_as_hash(@disk_format) })
        end

        def create
          @disk_format = DiskFormat.new(disk_format_params)
          @disk_format.save!
          render_success({ disk_format: DiskFormatSerializer.render_as_hash(@disk_format) }, status: :created)
        end

        def update
          @disk_format.update!(disk_format_params)
          render_success({ disk_format: DiskFormatSerializer.render_as_hash(@disk_format) })
        end

        def destroy
          @disk_format.destroy!
          render json: { message: "Disk format deleted successfully" }, status: :ok
        end

        private

        def set_disk_format
          @disk_format = DiskFormat.find(params[:id])
        end

        def disk_format_params
          params.require(:disk_format).permit(:name)
        end

        def check_disks_before_destroy
          if @disk_format.disks.exists?
            render json: { error: "Cannot delete disk format with associated disks" }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
