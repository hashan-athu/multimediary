require "test_helper"

module Api
  module V1
    module Admin
      class SessionsControllerTest < ActionDispatch::IntegrationTest
        setup do
          @user = create(:user, email: "admin@test.com", password: "password123")
        end

        test "login returns JWT token" do
          post "/api/v1/admin/login", params: {
            user: { email: @user.email, password: "password123" }
          }, as: :json
          assert_response :ok
          body = JSON.parse(response.body)
          assert body.key?("token")
          assert body["token"].present?
        end

        test "login fails with wrong password" do
          post "/api/v1/admin/login", params: {
            user: { email: @user.email, password: "wrongpassword" }
          }, as: :json
          assert_response :unauthorized
        end

        test "second login rejected when active session exists" do
          post "/api/v1/admin/login", params: {
            user: { email: @user.email, password: "password123" }
          }, as: :json
          assert_response :ok

          post "/api/v1/admin/login", params: {
            user: { email: @user.email, password: "password123" }
          }, as: :json
          assert_response :forbidden
          assert_match "already logged in", response.body.downcase
        end

        test "reset_all requires super_admin role" do
          editor = create(:user)
          headers = auth_headers_for(editor)
          post "/api/v1/admin/sessions/reset_all", headers: headers
          assert_response :forbidden
        end

        test "reset_all succeeds for super_admin" do
          super_admin = create(:user, :super_admin)
          headers = auth_headers_for(super_admin)
          post "/api/v1/admin/sessions/reset_all", headers: headers
          assert_response :ok
        end
      end
    end
  end
end
