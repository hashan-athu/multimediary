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

  test "recent returns movies ordered by created_at desc" do
    3.times { |i| create(:movie, :with_poster, created_at: i.days.ago) }
    get recent_api_v1_public_movies_url, params: { count: 3 }
    assert_response :ok
    assert JSON.parse(response.body)["movies"].size <= 3
  end

  test "random returns up to count movies" do
    create_list(:movie, 5, :with_poster)
    get random_api_v1_public_movies_url, params: { count: 3 }
    assert_response :ok
    assert JSON.parse(response.body)["movies"].size <= 3
  end

  test "show returns full detail including cast and ratings" do
    actor    = create(:actor)
    reviewer = create(:reviewer)
    movie    = create(:movie)
    movie.actors << actor
    create(:rating, movie: movie, reviewer: reviewer)

    get api_v1_public_movie_url(movie)
    assert_response :ok
    data = JSON.parse(response.body)["movie"]
    assert data.key?("actors")
    assert data.key?("ratings")
    assert data.key?("director")
    assert data.key?("average_rating")
  end

  test "index filters by category" do
    cat1 = create(:category)
    cat2 = create(:category)
    movie1 = create(:movie, category: cat1)
    movie2 = create(:movie, category: cat2)

    get api_v1_public_movies_url, params: { q: { category_id_eq: cat1.id } }
    ids = JSON.parse(response.body)["movies"].map { |m| m["id"] }
    assert_includes ids, movie1.id
    assert_not_includes ids, movie2.id
  end
end
