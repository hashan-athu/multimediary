class ApplicationController < ActionController::API
  rescue_from StandardError, with: :render_internal_error

  private

  def render_internal_error(exception)
    Rails.logger.error(exception.full_message)
    render json: { error: "Internal Server Error" }, status: :internal_server_error
  end
end
