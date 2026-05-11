# frozen_string_literal: true

module Api
  module V1
    module Public
      class CategoriesController < BaseController
        # GET /api/v1/public/categories
        def index
          @categories = Category.select(
            "categories.*",
            "COUNT(movies.id) AS movie_count"
          )
          .joins("LEFT JOIN movies ON movies.category_id = categories.id")
          .group("categories.id")
          .order("movie_count DESC")

          render json: {
            categories: @categories.map do |cat|
              {
                id:          cat.id,
                name:        cat.name,
                movie_count: cat.movie_count.to_i
              }
            end
          }
        end

        # GET /api/v1/public/categories/:id
        def show
          @category = Category.find(params[:id])
          @movies   = Movie.includes(:genres, :qualities, :disk)
                           .where(category_id: @category.id)
                           .order(name: :asc)
          @movies   = paginate(@movies)

          render json: {
            category: ::Public::CategorySerializer.render_as_hash(@category),
            movies:   ::Public::MovieCardSerializer.render_as_hash(@movies),
            meta:     pagination_meta(@movies)
          }
        end
      end
    end
  end
end
