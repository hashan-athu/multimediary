# frozen_string_literal: true

module Api
  module V1
    module Public
      class MoviesController < BaseController
        # GET /api/v1/public/movies
        def index
          @movies = Movie.includes(:category, :disk, :genres, :qualities)
          @movies = @movies.ransack(ransack_params).result if ransack_params.present?
          @movies = if params[:sort].present?
            apply_sort(@movies, default_column: :year, default_direction: :desc)
          else
            @movies.order(year: :desc, name: :asc)
          end
          @movies = paginate(@movies)

          render json: {
            movies: ::Public::MovieCardSerializer.render_as_hash(@movies),
            meta:   pagination_meta(@movies)
          }
        end

        # GET /api/v1/public/movies/:id
        def show
          @movie = Movie.includes(
            :category, :genres, :qualities, :director,
            :actors, :disk, { movie_ratings: :reviewer }
          ).find(params[:id])

          render json: {
            movie: ::Public::MovieDetailSerializer.render_as_hash(@movie)
          }
        end

        # GET /api/v1/public/movies/recent
        def recent
          count = [ (params[:count] || 12).to_i, 48 ].min
          @movies = Movie.includes(:category, :disk, :genres, :qualities)
                         .where("NULLIF(backdrop_url, '') IS NOT NULL OR NULLIF(poster_url, '') IS NOT NULL")
                         .order(created_at: :desc)
                         .limit(count)

          render json: {
            movies: ::Public::MovieCardSerializer.render_as_hash(@movies)
          }
        end

        # GET /api/v1/public/movies/random
        def random
          count = [ (params[:count] || 8).to_i, 24 ].min
          @movies = Movie.includes(:category, :disk, :genres, :qualities)
                         .where("NULLIF(backdrop_url, '') IS NOT NULL OR NULLIF(poster_url, '') IS NOT NULL")
                         .order(Arel.sql("RANDOM()"))
                         .limit(count)

          render json: {
            movies: ::Public::MovieCardSerializer.render_as_hash(@movies)
          }
        end

        private

        def ransack_params
          params.permit(q: {}).dig(:q) || {}
        end
      end
    end
  end
end
