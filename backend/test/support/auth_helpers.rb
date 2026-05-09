# frozen_string_literal: true

module AuthHelpers
  def auth_headers_for(user)
    token = Warden::JWTAuth::UserEncoder.new.call(user, :api_v1_admin_user, nil).first
    { "Authorization" => "Bearer #{token}" }
  end
end
