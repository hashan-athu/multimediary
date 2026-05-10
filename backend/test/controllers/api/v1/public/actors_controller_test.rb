# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::ActorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @actor = create(:actor, first_name: "Tom", last_name: "Hanks")
    @movie = create(:movie)
    @movie.actors << @actor
  end

  test "lists actors with movie counts" do
    get api_v1_public_actors_url
    assert_response :ok
    json   = JSON.parse(response.body)
    actor  = json["actors"].find { |a| a["id"] == @actor.id }
    assert_not_nil actor
    assert actor["movie_count"] >= 1
    assert json.key?("meta")
  end

  test "filters actors by name" do
    create(:actor, first_name: "Other", last_name: "Person")
    get api_v1_public_actors_url, params: { q: { first_name_or_last_name_cont: "Hanks" } }
    assert_response :ok
    names = JSON.parse(response.body)["actors"].map { |a| a["last_name"] }
    assert_includes names, "Hanks"
  end

  test "shows actor with their movies" do
    get api_v1_public_actor_url(@actor)
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("actor")
    assert json.key?("movies")
    assert json.key?("meta")
    assert json.dig("actor", "movie_count") >= 1
  end

  test "returns 404 for unknown actor" do
    get api_v1_public_actor_url(id: 0)
    assert_response :not_found
  end
end
