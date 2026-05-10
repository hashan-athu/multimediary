# frozen_string_literal: true

module Api
  module V1
    module Public
      class BaseController < ApplicationController
        rescue_from ActiveRecord::RecordNotFound,         with: :render_not_found
        rescue_from ActionController::ParameterMissing,   with: :render_bad_request

        private

        def render_not_found(exception)
          render json: { error: "Not Found", message: exception.message },
                 status: :not_found
        end

        def render_bad_request(exception)
          render json: { error: "Bad Request", message: exception.message },
                 status: :bad_request
        end

        def paginate(collection)
          collection.page(params[:page]).per(params[:per_page] || 24)
        end

        def pagination_meta(collection)
          {
            current_page: collection.current_page,
            total_pages:  collection.total_pages,
            total_count:  collection.total_count,
            per_page:     collection.limit_value
          }
        end

        def apply_sort(scope, default_column: :created_at, default_direction: :desc)
          column    = params[:sort].presence&.to_sym || default_column
          direction = params[:direction].presence&.downcase == "asc" ? :asc : :desc
          allowed   = scope.klass.try(:ransackable_attributes) || []
          return scope.order(default_column => default_direction) unless allowed.include?(column.to_s)
          scope.order(column => direction)
        end
      end
    end
  end
end
