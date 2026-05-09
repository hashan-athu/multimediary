# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::MoviesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @movie = create(:movie)
  end

  test "lists movies without auth" do
    get api_v1_public_movies_url
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("movies")
    assert json.key?("meta")
  end

  test "shows a movie without auth" do
    get api_v1_public_movie_url(@movie)
    assert_response :ok
    assert_equal @movie.id, JSON.parse(response.body).dig("movie", "id")
  end

  test "returns 404 for unknown movie" do
    get api_v1_public_movie_url(id: 0)
    assert_response :not_found
  end

  test "search filters movies by name" do
    create(:movie, name: "Inception")
    create(:movie, name: "Interstellar")

    get api_v1_public_movies_url, params: { q: { name_cont: "Incep" } }
    assert_response :ok
    names = JSON.parse(response.body)["movies"].map { |m| m["name"] }
    assert_includes names, "Inception"
    assert_not_includes names, "Interstellar"
  end

  test "pagination meta is present and correct" do
    create_list(:movie, 3)
    get api_v1_public_movies_url, params: { per_page: 2, page: 1 }
    assert_response :ok
    meta = JSON.parse(response.body)["meta"]
    assert_equal 2, meta["per_page"]
    assert meta["total_count"] >= 3
    assert meta["total_pages"] >= 2
  end
end
