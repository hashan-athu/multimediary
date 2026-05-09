# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @super_admin = create(:user, role: :super_admin)
    @admin       = create(:user, role: :admin)
    @editor      = create(:user, role: :editor)
  end

  test "super_admin can list users" do
    get api_v1_admin_users_url, headers: auth_headers_for(@super_admin)
    assert_response :ok
  end

  test "admin can list users" do
    get api_v1_admin_users_url, headers: auth_headers_for(@admin)
    assert_response :ok
  end

  test "editor cannot list users" do
    get api_v1_admin_users_url, headers: auth_headers_for(@editor)
    assert_response :forbidden
  end

  test "super_admin can change a user role" do
    patch api_v1_admin_user_url(@editor),
          params: { user: { role: :analyst } },
          headers: auth_headers_for(@super_admin),
          as: :json
    assert_response :ok
    assert_equal "analyst", @editor.reload.role
  end

  test "super_admin cannot demote themselves" do
    patch api_v1_admin_user_url(@super_admin),
          params: { user: { role: :editor } },
          headers: auth_headers_for(@super_admin),
          as: :json
    assert_response :unprocessable_entity
  end

  test "admin cannot change roles" do
    patch api_v1_admin_user_url(@editor),
          params: { user: { role: :analyst } },
          headers: auth_headers_for(@admin),
          as: :json
    assert_response :forbidden
  end

  test "super_admin can destroy a user" do
    target = create(:user, role: :editor)
    delete api_v1_admin_user_url(target), headers: auth_headers_for(@super_admin)
    assert_response :ok
  end

  test "admin cannot destroy users" do
    delete api_v1_admin_user_url(@editor), headers: auth_headers_for(@admin)
    assert_response :forbidden
  end

  test "super_admin can create a user" do
    post api_v1_admin_users_url,
         params: { user: { email: "new@example.com", password: "password123",
                           password_confirmation: "password123", role: :editor } },
         headers: auth_headers_for(@super_admin),
         as: :json
    assert_response :created
    assert User.exists?(email: "new@example.com")
  end

  test "admin cannot create users" do
    post api_v1_admin_users_url,
         params: { user: { email: "new@example.com", password: "password123",
                           password_confirmation: "password123", role: :editor } },
         headers: auth_headers_for(@admin),
         as: :json
    assert_response :forbidden
  end

  test "returns 422 on invalid user params" do
    post api_v1_admin_users_url,
         params: { user: { email: "not-an-email", password: "short" } },
         headers: auth_headers_for(@super_admin),
         as: :json
    assert_response :unprocessable_entity
  end
end
