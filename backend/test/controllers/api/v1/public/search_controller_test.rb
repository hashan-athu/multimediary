# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::SearchControllerTest < ActionDispatch::IntegrationTest
  setup do
    @movie    = create(:movie, name: "Inception")
    @actor    = create(:actor, first_name: "Leonardo", last_name: "DiCaprio")
    @director = create(:director, first_name: "Christopher", last_name: "Nolan")
  end

  test "returns movies and people matching query" do
    get api_v1_public_search_url, params: { q: "Inception" }
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("movies")
    assert json.key?("actors")
    assert json.key?("directors")
    assert json.key?("total_count")
    assert_equal "Inception", json["query"]
  end

  test "returns 400 when q param missing" do
    get api_v1_public_search_url
    assert_response :bad_request
  end

  test "returns 400 when query is too short" do
    get api_v1_public_search_url, params: { q: "a" }
    assert_response :bad_request
  end

  test "finds actors by name" do
    get api_v1_public_search_url, params: { q: "DiCaprio" }
    assert_response :ok
    actor_names = JSON.parse(response.body)["actors"].map { |a| a["last_name"] }
    assert_includes actor_names, "DiCaprio"
  end
end
