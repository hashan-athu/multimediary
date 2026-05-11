# frozen_string_literal: true

module Api
  module V1
    module Public
      class SearchController < BaseController
        # GET /api/v1/public/search?q=inception&limit=5
        def index
          query = params[:q].to_s.strip
          return render json: { error: "q param required" }, status: :bad_request if query.blank?
          return render json: { error: "Query too short" }, status: :bad_request if query.length < 2

          limit = [ (params[:limit] || 8).to_i, 20 ].min
          term  = "%#{query}%"

          movies = Movie.includes(:category, :disk, :genres, :qualities)
                        .where("movies.name ILIKE ? OR movies.description ILIKE ?", term, term)
                        .order(name: :asc)
                        .limit(limit)

          actors = Actor.where(
            "first_name ILIKE ? OR last_name ILIKE ? OR CONCAT(first_name, ' ', last_name) ILIKE ?",
            term, term, term
          ).limit(limit / 2)

          directors = Director.where(
            "first_name ILIKE ? OR last_name ILIKE ? OR CONCAT(first_name, ' ', last_name) ILIKE ?",
            term, term, term
          ).limit(limit / 2)

          render json: {
            query:     query,
            movies:    ::Public::MovieCardSerializer.render_as_hash(movies),
            actors:    actors.map { |a|
              ::Public::ActorSerializer.render_as_hash(a).merge(movie_count: a.movies.count)
            },
            directors: directors.map { |d|
              ::Public::DirectorSerializer.render_as_hash(d).merge(movie_count: d.movies.count)
            },
            total_count: movies.size + actors.size + directors.size
          }
        end
      end
    end
  end
end
