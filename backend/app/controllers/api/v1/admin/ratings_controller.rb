# frozen_string_literal: true

module Api
  module V1
    module Admin
      class RatingsController < BaseController
        before_action :set_movie
        before_action :set_rating, only: [ :update, :destroy ]

        def index
          @ratings = Rating.where(movie_id: @movie.id).includes(:reviewer)
          render_success({ ratings: RatingSerializer.render_as_hash(@ratings) })
        end

        def create
          authorize! :create, Rating

          @rating = Rating.new(rating_params)
          @rating.movie = @movie

          if @rating.save
            render_success(
              { rating: RatingSerializer.render_as_hash(@rating) },
              status: :created
            )
          else
            render json: { error: "Unprocessable Entity",
                           errors: @rating.errors.full_messages },
                   status: :unprocessable_entity
          end
        end

        def update
          authorize! :update, @rating

          if @rating.update(rating_params)
            render_success({ rating: RatingSerializer.render_as_hash(@rating) })
          else
            render json: { error: "Unprocessable Entity",
                           errors: @rating.errors.full_messages },
                   status: :unprocessable_entity
          end
        end

        def destroy
          authorize! :destroy, @rating
          @rating.destroy!
          render json: { message: "Rating deleted" }, status: :ok
        end

        private

        def set_movie
          @movie = Movie.find(params[:movie_id])
        end

        # Scope the rating lookup to the parent movie to prevent
        # cross-movie rating manipulation via URL tampering.
        def set_rating
          @rating = Rating.where(movie_id: @movie.id).find(params[:id])
        end

        def rating_params
          params.require(:rating).permit(:rating_value, :rating_out_of, :reviewer_id)
        end
      end
    end
  end
end
