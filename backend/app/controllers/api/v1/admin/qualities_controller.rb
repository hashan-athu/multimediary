# frozen_string_literal: true

module Api
  module V1
    module Admin
      class QualitiesController < BaseController
        before_action :set_quality, only: [ :show, :update, :destroy ]
        before_action :check_movies_before_destroy, only: [ :destroy ]
        load_and_authorize_resource class: Quality

        def index
          @qualities = Quality.order(name: :asc)
          @qualities = paginate(@qualities)

          render_success({
            qualities: QualitySerializer.render_as_hash(@qualities),
            meta: pagination_meta(@qualities)
          })
        end

        def show
          render_success({ quality: QualitySerializer.render_as_hash(@quality) })
        end

        def create
          @quality = Quality.new(quality_params)
          @quality.save!
          render_success({ quality: QualitySerializer.render_as_hash(@quality) }, status: :created)
        end

        def update
          @quality.update!(quality_params)
          render_success({ quality: QualitySerializer.render_as_hash(@quality) })
        end

        def destroy
          @quality.destroy!
          render json: { message: "Quality deleted successfully" }, status: :ok
        end

        private

        def set_quality
          @quality = Quality.find(params[:id])
        end

        def quality_params
          params.require(:quality).permit(:name)
        end

        def check_movies_before_destroy
          if @quality.movies.exists?
            render json: { error: "Cannot delete quality with associated movies" }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
