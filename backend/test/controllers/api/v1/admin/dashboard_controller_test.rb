# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::DashboardControllerTest < ActionDispatch::IntegrationTest
  setup do
    @super_admin = create(:user, role: :super_admin)
    @analyst     = create(:user, role: :analyst)
    @movie       = create(:movie)
  end

  test "super_admin can view dashboard" do
    get api_v1_admin_dashboard_url, headers: auth_headers_for(@super_admin)
    assert_response :ok

    json = JSON.parse(response.body)
    assert json.key?("stats")
    assert json.key?("recent_movies")
    assert json.dig("stats", "movies", "total") >= 1
    assert json.dig("stats", "disks", "total") >= 0
    assert json.dig("stats", "people", "actors") >= 0
    assert json.dig("stats", "storage", "total_gb") >= 0
  end

  test "analyst can view dashboard" do
    get api_v1_admin_dashboard_url, headers: auth_headers_for(@analyst)
    assert_response :ok
  end

  test "unauthenticated request is rejected" do
    get api_v1_admin_dashboard_url
    assert_response :unauthorized
  end

  test "recent_movies returns at most 8 entries" do
    create_list(:movie, 10)
    get api_v1_admin_dashboard_url, headers: auth_headers_for(@super_admin)
    recent = JSON.parse(response.body)["recent_movies"]
    assert recent.size <= 8
  end
end
