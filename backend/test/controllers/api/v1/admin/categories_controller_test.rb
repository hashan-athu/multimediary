# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::CategoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin    = create(:user, role: :admin)
    @editor   = create(:user, role: :editor)
    @analyst  = create(:user, role: :analyst)
    @category = create(:category)
  end

  test "editor can list categories" do
    get api_v1_admin_categories_url, headers: auth_headers_for(@editor)
    assert_response :ok
    assert JSON.parse(response.body).key?("categories")
  end

  test "analyst can list categories" do
    get api_v1_admin_categories_url, headers: auth_headers_for(@analyst)
    assert_response :ok
  end

  test "editor can create category" do
    post api_v1_admin_categories_url,
         params: { category: { name: "Comedy" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :created
  end

  test "analyst cannot create category" do
    post api_v1_admin_categories_url,
         params: { category: { name: "Comedy" } },
         headers: auth_headers_for(@analyst),
         as: :json
    assert_response :forbidden
  end

  test "returns 422 on missing name" do
    post api_v1_admin_categories_url,
         params: { category: { name: nil } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :unprocessable_entity
  end

  test "editor can update category" do
    patch api_v1_admin_category_url(@category),
          params: { category: { name: "Drama" } },
          headers: auth_headers_for(@editor),
          as: :json
    assert_response :ok
    assert_equal "Drama", JSON.parse(response.body).dig("category", "name")
  end

  test "admin cannot destroy category that has movies" do
    create(:movie, category: @category)

    delete api_v1_admin_category_url(@category), headers: auth_headers_for(@admin)
    assert_response :unprocessable_entity
    assert_match "movies", JSON.parse(response.body)["error"].downcase
  end

  test "admin can destroy category with no movies" do
    delete api_v1_admin_category_url(@category), headers: auth_headers_for(@admin)
    assert_response :ok
  end

  test "editor cannot destroy category" do
    delete api_v1_admin_category_url(@category), headers: auth_headers_for(@editor)
    assert_response :forbidden
  end

  test "unauthenticated request is rejected" do
    get api_v1_admin_categories_url
    assert_response :unauthorized
  end
end
