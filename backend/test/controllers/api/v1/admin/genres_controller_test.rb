# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::GenresControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin   = create(:user, role: :admin)
    @editor  = create(:user, role: :editor)
    @analyst = create(:user, role: :analyst)
    @genre   = create(:genre)
  end

  test "editor can list genres" do
    get api_v1_admin_genres_url, headers: auth_headers_for(@editor)
    assert_response :ok
    assert JSON.parse(response.body).key?("genres")
  end

  test "analyst can list genres" do
    get api_v1_admin_genres_url, headers: auth_headers_for(@analyst)
    assert_response :ok
  end

  test "editor can create genre" do
    post api_v1_admin_genres_url,
         params: { genre: { name: "Horror" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :created
  end

  test "analyst cannot create genre" do
    post api_v1_admin_genres_url,
         params: { genre: { name: "Horror" } },
         headers: auth_headers_for(@analyst),
         as: :json
    assert_response :forbidden
  end

  test "returns 422 on missing name" do
    post api_v1_admin_genres_url,
         params: { genre: { description: "something" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :unprocessable_entity
  end

  test "editor can update genre" do
    patch api_v1_admin_genre_url(@genre),
          params: { genre: { description: "Updated desc" } },
          headers: auth_headers_for(@editor),
          as: :json
    assert_response :ok
  end

  test "admin cannot destroy genre that has movies" do
    movie = create(:movie)
    movie.genres << @genre

    delete api_v1_admin_genre_url(@genre), headers: auth_headers_for(@admin)
    assert_response :unprocessable_entity
    assert_match "movies", JSON.parse(response.body)["error"].downcase
  end

  test "admin can destroy genre with no movies" do
    delete api_v1_admin_genre_url(@genre), headers: auth_headers_for(@admin)
    assert_response :ok
  end

  test "editor cannot destroy genre" do
    delete api_v1_admin_genre_url(@genre), headers: auth_headers_for(@editor)
    assert_response :forbidden
  end

  test "unauthenticated request is rejected" do
    get api_v1_admin_genres_url
    assert_response :unauthorized
  end
end
