# frozen_string_literal: true

module Api
  module V1
    module Admin
      class MoviesController < BaseController
        before_action :set_movie, only: [ :show, :update, :destroy ]
        load_and_authorize_resource class: Movie

        def index
          @movies = Movie.includes(:category, :disk, :genres, :qualities, :director)
          @movies = @movies.ransack(params[:q]).result if params[:q].present?
          @movies = apply_sort(@movies)
          @movies = paginate(@movies)

          render_success({
            movies: MovieSerializer.render_as_hash(@movies, view: :list),
            meta: pagination_meta(@movies)
          })
        end

        def show
          render_success({ movie: MovieSerializer.render_as_hash(@movie, view: :detail) })
        end

        def create
          @movie = Movie.new(movie_params)
          @movie.save!
          render_success({ movie: MovieSerializer.render_as_hash(@movie, view: :detail) }, status: :created)
        end

        def update
          @movie.update!(movie_params)
          render_success({ movie: MovieSerializer.render_as_hash(@movie, view: :detail) })
        end

        def destroy
          @movie.destroy!
          render json: { message: "Movie deleted successfully" }, status: :ok
        end

        # POST /api/v1/admin/movies/tmdb_search
        def tmdb_search
          authorize! :create, Movie
          query = params[:query].to_s.strip
          return render json: { error: "query param required" }, status: :bad_request if query.blank?

          results = TmdbService.new.search(query)
          render_success({ results: results })
        rescue TmdbService::TmdbError => e
          render json: { error: e.message }, status: :bad_gateway
        end

        # POST /api/v1/admin/movies/tmdb_import
        def tmdb_import
          authorize! :create, Movie
          tmdb_id = params[:tmdb_id]
          return render json: { error: "tmdb_id required" }, status: :bad_request if tmdb_id.blank?

          existing = Movie.find_by(tmdb_id: tmdb_id)
          if existing
            return render json: {
              error: "Conflict",
              message: "Movie already imported",
              movie: MovieSerializer.render_as_hash(existing, view: :detail)
            }, status: :conflict
          end

          data = TmdbService.new.movie_detail(tmdb_id)

          ActiveRecord::Base.transaction do
            director = find_or_create_director(data[:director]) if data[:director]
            genres   = find_or_create_genres(data[:genres])
            actors   = find_or_create_actors(data[:actors])

            @movie = Movie.create!(
              name:        data[:name],
              year:        data[:year],
              description: data[:description],
              tagline:     data[:tagline],
              runtime:     data[:runtime],
              language:    data[:language],
              country:     data[:country],
              poster_url:  data[:poster_url],
              tmdb_id:     data[:tmdb_id],
              disk_id:     params[:disk_id],
              category_id: params[:category_id],
              director:    director
            )
            @movie.genres  = genres
            @movie.actors  = actors
          end

          render_success(
            { movie: MovieSerializer.render_as_hash(@movie, view: :detail) },
            status: :created
          )
        rescue TmdbService::TmdbError => e
          render json: { error: e.message }, status: :bad_gateway
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: "Unprocessable Entity", errors: e.record.errors.full_messages },
                 status: :unprocessable_entity
        end

        private

        def set_movie
          @movie = Movie.find(params[:id])
        end

        def movie_params
          params.require(:movie).permit(
            :name, :year, :language, :country, :description, :story,
            :tagline, :runtime, :file_size, :version, :poster_url,
            :disk_id, :category_id, :director_id,
            actor_ids: [], genre_ids: [], quality_ids: []
          )
        end

        def find_or_create_director(data)
          Director.find_or_create_by!(first_name: data[:first_name], last_name: data[:last_name])
        end

        def find_or_create_genres(names)
          names.map { |name| Genre.find_or_create_by!(name: name) }
        end

        def find_or_create_actors(actors_data)
          actors_data.map do |a|
            Actor.find_or_create_by!(first_name: a[:first_name], last_name: a[:last_name]) do |actor|
              actor.image_url = a[:image_url]
            end
          end
        end
      end
    end
  end
end
