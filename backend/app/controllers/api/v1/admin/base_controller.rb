# frozen_string_literal: true

module Api
  module V1
    module Admin
      class BaseController < ApplicationController
        before_action :authenticate_api_v1_admin_user!
        before_action :set_current_user

        rescue_from CanCan::AccessDenied, with: :render_forbidden
        rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
        rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable

        private

        def set_current_user
          @current_user = current_api_v1_admin_user
        end

        def current_ability
          @current_ability ||= Ability.new(@current_user)
        end

        def render_forbidden(exception)
          render json: { error: "Forbidden", message: exception.message }, status: :forbidden
        end

        def render_not_found(exception)
          render json: { error: "Not Found", message: exception.message }, status: :not_found
        end

        def render_unprocessable(exception)
          render json: { error: "Unprocessable Entity", errors: exception.record.errors.full_messages },
                 status: :unprocessable_entity
        end

        def render_success(data, status: :ok)
          render json: data, status: status
        end

        def paginate(collection)
          collection.page(params[:page]).per(params[:per_page] || 25)
        end

        def pagination_meta(collection)
          {
            current_page: collection.current_page,
            total_pages: collection.total_pages,
            total_count: collection.total_count,
            per_page: collection.limit_value
          }
        end

        def apply_sort(scope, default_column: :created_at, default_direction: :desc)
          column    = params[:sort].presence || default_column
          direction = params[:direction].presence&.downcase == "asc" ? :asc : :desc

          allowed = scope.klass.try(:ransackable_attributes) || []
          return scope.order(default_column => default_direction) unless allowed.include?(column.to_s)

          scope.order(column => direction)
        end
      end
    end
  end
end
