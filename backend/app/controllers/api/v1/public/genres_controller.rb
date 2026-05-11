# frozen_string_literal: true

module Api
  module V1
    module Public
      class GenresController < BaseController
        # GET /api/v1/public/genres
        def index
          @genres = Genre.select(
            "genres.*",
            "COUNT(DISTINCT genres_movies.movie_id) AS movie_count"
          )
          .joins("LEFT JOIN genres_movies ON genres_movies.genre_id = genres.id")
          .group("genres.id")
          .order("movie_count DESC")

          render json: {
            genres: @genres.map do |g|
              {
                id:          g.id,
                name:        g.name,
                description: g.description,
                movie_count: g.movie_count.to_i
              }
            end
          }
        end

        # GET /api/v1/public/genres/:id
        def show
          @genre  = Genre.find(params[:id])
          @movies = Movie.includes(:category, :qualities, :disk)
                         .joins(:genres)
                         .where(genres: { id: @genre.id })
                         .order(name: :asc)
          @movies = paginate(@movies)

          render json: {
            genre:  ::Public::GenreSerializer.render_as_hash(@genre),
            movies: ::Public::MovieCardSerializer.render_as_hash(@movies),
            meta:   pagination_meta(@movies)
          }
        end
      end
    end
  end
end
