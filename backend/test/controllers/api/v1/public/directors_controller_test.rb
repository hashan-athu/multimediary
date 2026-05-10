# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::DirectorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @director = create(:director, first_name: "Steven", last_name: "Spielberg")
    @movie    = create(:movie, director: @director)
  end

  test "lists directors with movie counts" do
    get api_v1_public_directors_url
    assert_response :ok
    json = JSON.parse(response.body)
    dir  = json["directors"].find { |d| d["id"] == @director.id }
    assert_not_nil dir
    assert dir["movie_count"] >= 1
    assert json.key?("meta")
  end

  test "filters directors by name" do
    get api_v1_public_directors_url, params: { q: { first_name_or_last_name_cont: "Spielberg" } }
    assert_response :ok
    names = JSON.parse(response.body)["directors"].map { |d| d["last_name"] }
    assert_includes names, "Spielberg"
  end

  test "shows director with their movies" do
    get api_v1_public_director_url(@director)
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("director")
    assert json.key?("movies")
    assert json.key?("meta")
    assert json.dig("director", "movie_count") >= 1
  end

  test "returns 404 for unknown director" do
    get api_v1_public_director_url(id: 0)
    assert_response :not_found
  end
end
