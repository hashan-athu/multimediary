class Api::V1::Admin::SessionsController < Devise::SessionsController
  respond_to :json

  before_action :configure_sign_in_params, only: [:create]
  prepend_before_action :check_existing_session, only: [:create]

  # Ensure we have a user for logout to clear the token
  before_action :authenticate_api_v1_admin_user!, only: [:destroy]

  def create
    # ... logs ...
    super do |resource|
      if resource.persisted?
        token = request.env['warden-jwt_auth.token']
        resource.update_column(:active_token, token)
      end
    end
  end
  def reset_all
    # Backdoor for super_admin to destroy all active sessions
    # Ensure current user is authenticated and is a super_admin
    unless current_api_v1_admin_user&.super_admin?
      render json: { error: "Unauthorized" }, status: :forbidden
      return
    end

    # Revoke all active tokens by adding them to the Denylist
    count = 0
    User.where.not(active_token: nil).find_each do |user|
      begin
        # Decode to get JTI and EXP for denylist
        payload = Warden::JWTAuth::TokenDecoder.new.call(user.active_token)
        jti = payload['jti']
        exp = payload['exp']
        
        # Add to denylist if not already there
        if JwtDenylist.exists?(jti: jti)
           # already in denylist
        else
           JwtDenylist.create!(jti: jti, exp: Time.at(exp))
        end
        count += 1
      rescue => e
        Rails.logger.warn "Failed to revoke token for user #{user.id}: #{e.message}"
      end
      
      # Clear active_token
      user.update_column(:active_token, nil)
    end
    Rails.logger.info "Reset all completed. Revoked #{count} tokens."

    render json: { message: "All user sessions have been destroyed." }, status: :ok
  end

  protected

  def configure_sign_in_params
    # Devise namespaced mapping expects :api_v1_admin_user, but client sends :user
    if params[:user]
      # Warden looks at request.params (Rack hash), which uses String keys
      request.params['api_v1_admin_user'] = params[:user].to_unsafe_h
    end
  end

  def check_existing_session
    # Check if the user trying to log in already has an active session
    email = params.dig(:user, :email)
    return unless email

    user = User.find_by(email: email)
    if user && user.active_token.present?
      begin
        # Verify if the stored token is still valid
        Warden::JWTAuth::UserDecoder.new.call(user.active_token, :api_v1_admin_user, nil)
        
        # If decode succeeds, the session is active
        render json: { 
          message: "You are already logged in.",
          error: "Session already active"
        }, status: :forbidden
      rescue => e
        # Token expired or invalid, allow new login
        # Optional: Clear the invalid token? user.update_column(:active_token, nil)
      end
    end
  end

  private

  def respond_with(resource, _opts = {})
    # This runs after successful login
    render json: {
      message: 'Logged in successfully.',
      user: resource,
      token: request.env['warden-jwt_auth.token']
    }, status: :ok
  end



  def respond_to_on_destroy(*_args)
    # This runs after logout
    if current_api_v1_admin_user
      current_api_v1_admin_user.update_column(:active_token, nil)
      render json: { message: "Logged out successfully" }, status: :ok
    else
      render json: { message: "Couldn't find an active session." }, status: :unauthorized
    end
  end
end