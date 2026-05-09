# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DirectorsController < BaseController
        before_action :set_director, only: [ :show, :update, :destroy ]
        load_and_authorize_resource class: Director

        def index
          @directors = Director.order(last_name: :asc, first_name: :asc)
          @directors = @directors.ransack(params[:q]).result if params[:q].present?
          @directors = paginate(@directors)

          render_success({
            directors: DirectorSerializer.render_as_hash(@directors),
            meta: pagination_meta(@directors)
          })
        end

        def show
          render_success({ director: DirectorSerializer.render_as_hash(@director) })
        end

        def create
          @director = Director.new(director_params)
          @director.save!
          render_success({ director: DirectorSerializer.render_as_hash(@director) }, status: :created)
        end

        def update
          @director.update!(director_params)
          render_success({ director: DirectorSerializer.render_as_hash(@director) })
        end

        def destroy
          @director.destroy!
          render json: { message: "Director deleted successfully" }, status: :ok
        end

        private

        def set_director
          @director = Director.find(params[:id])
        end

        def director_params
          params.require(:director).permit(:first_name, :last_name, :date_of_birth, :image_url)
        end
      end
    end
  end
end
