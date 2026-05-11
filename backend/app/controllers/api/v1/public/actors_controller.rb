# frozen_string_literal: true

module Api
  module V1
    module Public
      class ActorsController < BaseController
        # GET /api/v1/public/actors
        def index
          @actors = Actor.select(
            "actors.*",
            "COUNT(DISTINCT actors_movies.movie_id) AS movie_count"
          )
          .joins("LEFT JOIN actors_movies ON actors_movies.actor_id = actors.id")
          .group("actors.id")
          .having("COUNT(DISTINCT actors_movies.movie_id) > 0")
          .order("movie_count DESC, actors.first_name ASC")

          if params.dig(:q, :first_name_or_last_name_cont).present?
            term = "%#{params.dig(:q, :first_name_or_last_name_cont)}%"
            @actors = @actors.where(
              "actors.first_name ILIKE ? OR actors.last_name ILIKE ?", term, term
            )
          end

          @actors = paginate(@actors)

          render json: {
            actors: @actors.map do |actor|
              ::Public::ActorSerializer.render_as_hash(actor)
                                     .merge(movie_count: actor.movie_count.to_i)
            end,
            meta: pagination_meta(@actors)
          }
        end

        # GET /api/v1/public/actors/:id
        def show
          @actor  = Actor.find(params[:id])
          @movies = Movie.includes(:category, :disk, :genres, :qualities)
                         .joins(:actors)
                         .where(actors: { id: @actor.id })
                         .order(year: :desc)
          @movies = paginate(@movies)

          render json: {
            actor:  ::Public::ActorSerializer.render_as_hash(@actor)
                                           .merge(movie_count: @movies.total_count),
            movies: ::Public::MovieCardSerializer.render_as_hash(@movies),
            meta:   pagination_meta(@movies)
          }
        end
      end
    end
  end
end
