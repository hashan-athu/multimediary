# frozen_string_literal: true

module Api
  module V1
    module Admin
      class CategoriesController < BaseController
        before_action :set_category, only: [ :show, :update, :destroy ]
        before_action :check_movies_before_destroy, only: [ :destroy ]
        load_and_authorize_resource class: Category

        def index
          @categories = Category.order(name: :asc)
          @categories = paginate(@categories)

          render_success({
            categories: CategorySerializer.render_as_hash(@categories),
            meta: pagination_meta(@categories)
          })
        end

        def show
          render_success({ category: CategorySerializer.render_as_hash(@category) })
        end

        def create
          @category = Category.new(category_params)
          @category.save!
          render_success({ category: CategorySerializer.render_as_hash(@category) }, status: :created)
        end

        def update
          @category.update!(category_params)
          render_success({ category: CategorySerializer.render_as_hash(@category) })
        end

        def destroy
          @category.destroy!
          render json: { message: "Category deleted successfully" }, status: :ok
        end

        private

        def set_category
          @category = Category.find(params[:id])
        end

        def category_params
          params.require(:category).permit(:name, :description, :image_url)
        end

        def check_movies_before_destroy
          if @category.movies.exists?
            render json: { error: "Cannot delete category with associated movies" }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
