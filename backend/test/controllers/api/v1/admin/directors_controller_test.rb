# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::DirectorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @editor   = create(:user, role: :editor)
    @analyst  = create(:user, role: :analyst)
    @director = create(:director)
  end

  test "editor can list directors" do
    get api_v1_admin_directors_url, headers: auth_headers_for(@editor)
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("directors")
    assert json.key?("meta")
  end

  test "analyst can list directors" do
    get api_v1_admin_directors_url, headers: auth_headers_for(@analyst)
    assert_response :ok
  end

  test "editor can create director" do
    post api_v1_admin_directors_url,
         params: { director: { first_name: "Steven", last_name: "Spielberg" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :created
  end

  test "analyst cannot create director" do
    post api_v1_admin_directors_url,
         params: { director: { first_name: "Steven", last_name: "Spielberg" } },
         headers: auth_headers_for(@analyst),
         as: :json
    assert_response :forbidden
  end

  test "returns 422 on missing first_name" do
    post api_v1_admin_directors_url,
         params: { director: { last_name: "Spielberg" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :unprocessable_entity
  end

  test "returns 422 on missing last_name" do
    post api_v1_admin_directors_url,
         params: { director: { first_name: "Steven" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :unprocessable_entity
  end

  test "editor can update director" do
    patch api_v1_admin_director_url(@director),
          params: { director: { last_name: "Kubrick" } },
          headers: auth_headers_for(@editor),
          as: :json
    assert_response :ok
    assert_equal "Kubrick", JSON.parse(response.body).dig("director", "last_name")
  end

  test "editor can destroy director" do
    delete api_v1_admin_director_url(@director), headers: auth_headers_for(@editor)
    assert_response :ok
  end

  test "unauthenticated request is rejected" do
    get api_v1_admin_directors_url
    assert_response :unauthorized
  end
end
