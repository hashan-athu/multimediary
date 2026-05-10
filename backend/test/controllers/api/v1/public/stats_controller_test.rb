# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::StatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @disk     = create(:disk)
    @category = create(:category)
    @movie    = create(:movie, disk: @disk, category: @category)
  end

  test "returns stats without auth" do
    get api_v1_public_stats_url
    assert_response :ok

    json = JSON.parse(response.body)
    assert json.key?("totals")
    assert json.key?("by_category")
    assert json.key?("by_format")
    assert json.key?("top_genres")
    assert json.dig("totals", "movies") >= 1
  end

  test "totals include all expected keys" do
    get api_v1_public_stats_url
    totals = JSON.parse(response.body)["totals"]
    %w[movies disks actors directors storage_gb].each do |key|
      assert totals.key?(key), "Expected totals to have key #{key}"
    end
  end
end
