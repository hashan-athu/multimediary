# frozen_string_literal: true

module Api
  module V1
    module Public
      class DirectorsController < BaseController

        # GET /api/v1/public/directors
        def index
          @directors = Director.select(
            "directors.*",
            "COUNT(DISTINCT movies.id) AS movie_count"
          )
          .joins("LEFT JOIN movies ON movies.director_id = directors.id")
          .group("directors.id")
          .having("COUNT(DISTINCT movies.id) > 0")
          .order("movie_count DESC, directors.first_name ASC")

          if params.dig(:q, :first_name_or_last_name_cont).present?
            term = "%#{params.dig(:q, :first_name_or_last_name_cont)}%"
            @directors = @directors.where(
              "directors.first_name ILIKE ? OR directors.last_name ILIKE ?", term, term
            )
          end

          @directors = paginate(@directors)

          render json: {
            directors: @directors.map do |dir|
              ::Public::DirectorSerializer.render_as_hash(dir)
                                        .merge(movie_count: dir.movie_count.to_i)
            end,
            meta: pagination_meta(@directors)
          }
        end

        # GET /api/v1/public/directors/:id
        def show
          @director = Director.find(params[:id])
          @movies   = Movie.includes(:category, :disk, :genres, :qualities)
                           .where(director_id: @director.id)
                           .order(year: :desc)
          @movies   = paginate(@movies)

          render json: {
            director: ::Public::DirectorSerializer.render_as_hash(@director)
                                                .merge(movie_count: @movies.total_count),
            movies:   ::Public::MovieCardSerializer.render_as_hash(@movies),
            meta:     pagination_meta(@movies)
          }
        end
      end
    end
  end
end
