# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::DisksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @disk  = create(:disk)
    @movie = create(:movie, disk: @disk)
  end

  test "lists disks with movie counts" do
    get api_v1_public_disks_url
    assert_response :ok
    json = JSON.parse(response.body)
    disk = json["disks"].find { |d| d["id"] == @disk.id }
    assert_not_nil disk
    assert disk["movie_count"] >= 1
  end

  test "shows disk with its movies" do
    get api_v1_public_disk_url(@disk)
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("disk")
    assert json.key?("movies")
    assert_equal @disk.name, json.dig("disk", "name")
    assert json.dig("disk", "movie_count") >= 1
  end

  test "returns 404 for unknown disk" do
    get api_v1_public_disk_url(id: 0)
    assert_response :not_found
  end
end
