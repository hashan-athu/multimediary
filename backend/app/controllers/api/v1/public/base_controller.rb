# frozen_string_literal: true

module Api
  module V1
    module Public
      class BaseController < ApplicationController
        rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

        private

        def render_not_found(exception)
          render json: { error: "Not Found", message: exception.message }, status: :not_found
        end
      end
    end
  end
end
