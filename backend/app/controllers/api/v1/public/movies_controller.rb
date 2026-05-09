# frozen_string_literal: true

module Api
  module V1
    module Public
      class MoviesController < Api::V1::Public::BaseController
        def index
          @movies = Movie.includes(:category, :disk, :genres, :qualities)
                         .order(name: :asc)
          @movies = @movies.ransack(params[:q]).result if params[:q].present?
          @movies = @movies.page(params[:page]).per(params[:per_page] || 25)

          render json: {
            movies: MovieSerializer.render_as_hash(@movies, view: :list),
            meta: {
              current_page: @movies.current_page,
              total_pages: @movies.total_pages,
              total_count: @movies.total_count,
              per_page: @movies.limit_value
            }
          }
        end

        def show
          @movie = Movie.includes(:director, :actors, :genres, :ratings, :category, :disk, :qualities)
                        .find(params[:id])
          render json: { movie: MovieSerializer.render_as_hash(@movie, view: :detail) }
        end
      end
    end
  end
end
