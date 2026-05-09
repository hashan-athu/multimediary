# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::DiskFormatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin       = create(:user, role: :admin)
    @editor      = create(:user, role: :editor)
    @analyst     = create(:user, role: :analyst)
    @disk_format = create(:disk_format)
  end

  test "editor can list disk_formats" do
    get api_v1_admin_disk_formats_url, headers: auth_headers_for(@editor)
    assert_response :ok
    assert JSON.parse(response.body).key?("disk_formats")
  end

  test "analyst can list disk_formats" do
    get api_v1_admin_disk_formats_url, headers: auth_headers_for(@analyst)
    assert_response :ok
  end

  test "editor can create disk_format" do
    post api_v1_admin_disk_formats_url,
         params: { disk_format: { name: "4K Blu-ray" } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :created
  end

  test "analyst cannot create disk_format" do
    post api_v1_admin_disk_formats_url,
         params: { disk_format: { name: "4K Blu-ray" } },
         headers: auth_headers_for(@analyst),
         as: :json
    assert_response :forbidden
  end

  test "editor can update disk_format" do
    patch api_v1_admin_disk_format_url(@disk_format),
          params: { disk_format: { name: "Blu-ray" } },
          headers: auth_headers_for(@editor),
          as: :json
    assert_response :ok
    assert_equal "Blu-ray", JSON.parse(response.body).dig("disk_format", "name")
  end

  test "cannot destroy disk_format that has disks" do
    create(:disk, disk_format: @disk_format)

    delete api_v1_admin_disk_format_url(@disk_format), headers: auth_headers_for(@admin)
    assert_response :unprocessable_entity
  end

  test "admin can destroy disk_format with no disks" do
    delete api_v1_admin_disk_format_url(@disk_format), headers: auth_headers_for(@admin)
    assert_response :ok
  end

  test "unauthenticated request is rejected" do
    get api_v1_admin_disk_formats_url
    assert_response :unauthorized
  end
end
