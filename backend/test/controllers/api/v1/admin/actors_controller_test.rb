# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::ActorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @editor  = create(:user, role: :editor)
    @analyst = create(:user, role: :analyst)
    @actor   = create(:actor)
  end

  test "editor can list actors" do
    get api_v1_admin_actors_url, headers: auth_headers_for(@editor)
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("actors")
    assert json.key?("meta")
  end

  test "analyst can list actors" do
    get api_v1_admin_actors_url, headers: auth_headers_for(@analyst)
    assert_response :ok
  end

  test "editor can create actor" do
    post api_v1_admin_actors_url,
         params: { actor: { first_name: "Tom", last_name: "Hanks", gender: "male" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :created
  end

  test "analyst cannot create actor" do
    post api_v1_admin_actors_url,
         params: { actor: { first_name: "Tom", last_name: "Hanks" } },
         headers: auth_headers_for(@analyst),
         as: :json
    assert_response :forbidden
  end

  test "returns 422 on missing first_name" do
    post api_v1_admin_actors_url,
         params: { actor: { last_name: "Hanks" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :unprocessable_entity
  end

  test "editor can update actor" do
    patch api_v1_admin_actor_url(@actor),
          params: { actor: { nationality: "American" } },
          headers: auth_headers_for(@editor),
          as: :json
    assert_response :ok
    assert_equal "American", JSON.parse(response.body).dig("actor", "nationality")
  end

  test "editor can destroy actor" do
    delete api_v1_admin_actor_url(@actor), headers: auth_headers_for(@editor)
    assert_response :ok
  end

  test "unauthenticated request is rejected" do
    get api_v1_admin_actors_url
    assert_response :unauthorized
  end
end
