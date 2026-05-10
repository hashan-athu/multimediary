# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::GenresControllerTest < ActionDispatch::IntegrationTest
  setup do
    @genre = create(:genre)
    @movie = create(:movie)
    @movie.genres << @genre
  end

  test "lists genres with movie counts" do
    get api_v1_public_genres_url
    assert_response :ok
    genres = JSON.parse(response.body)["genres"]
    genre  = genres.find { |g| g["id"] == @genre.id }
    assert_not_nil genre
    assert genre["movie_count"] >= 1
  end

  test "shows genre with its movies" do
    get api_v1_public_genre_url(@genre)
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("genre")
    assert json.key?("movies")
    assert json.key?("meta")
  end

  test "returns 404 for unknown genre" do
    get api_v1_public_genre_url(id: 0)
    assert_response :not_found
  end
end
