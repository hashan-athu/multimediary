# frozen_string_literal: true

module Api
  module V1
    module Admin
      class GenresController < BaseController
        before_action :set_genre, only: [ :show, :update, :destroy ]
        before_action :check_movies_before_destroy, only: [ :destroy ]
        load_and_authorize_resource class: Genre

        def index
          @genres = Genre.order(name: :asc)
          @genres = paginate(@genres)

          render_success({
            genres: GenreSerializer.render_as_hash(@genres),
            meta: pagination_meta(@genres)
          })
        end

        def show
          render_success({ genre: GenreSerializer.render_as_hash(@genre) })
        end

        def create
          @genre = Genre.new(genre_params)
          @genre.save!
          render_success({ genre: GenreSerializer.render_as_hash(@genre) }, status: :created)
        end

        def update
          @genre.update!(genre_params)
          render_success({ genre: GenreSerializer.render_as_hash(@genre) })
        end

        def destroy
          @genre.destroy!
          render json: { message: "Genre deleted successfully" }, status: :ok
        end

        private

        def set_genre
          @genre = Genre.find(params[:id])
        end

        def genre_params
          params.require(:genre).permit(:name, :description, :image_url)
        end

        def check_movies_before_destroy
          if @genre.movies.exists?
            render json: { error: "Cannot delete genre with associated movies" }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
