# frozen_string_literal: true

module Api
  module V1
    module Public
      module Auth
        # Placeholder public session endpoint.
        # Currently returns a static anonymous token from credentials.
        # Revisit when the Next.js frontend is built — consider anonymous JWT or API key strategy.
        class SessionsController < Api::V1::Public::BaseController
          def create
            token = Rails.application.credentials.dig(:public_session_secret) ||
                    SecureRandom.hex(32)
            render json: { token: token }, status: :created
          end
        end
      end
    end
  end
end
