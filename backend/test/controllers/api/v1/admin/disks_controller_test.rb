require "test_helper"

module Api
  module V1
    module Admin
      class DisksControllerTest < ActionDispatch::IntegrationTest
        setup do
          @admin = create(:user, :admin)
          @headers = auth_headers_for(@admin)
          @disk_format = create(:disk_format)
          @disk = create(:disk, disk_format: @disk_format)
        end

        test "GET show includes movie list in detail view" do
          movie = create(:movie, disk: @disk)
          get "/api/v1/admin/disks/#{@disk.id}", headers: @headers
          assert_response :ok
          body = JSON.parse(response.body)
          assert body["disk"].key?("movies")
          assert_equal movie.id, body["disk"]["movies"].first["id"]
        end

        test "DELETE destroy blocked when disk has movies" do
          create(:movie, disk: @disk)
          delete "/api/v1/admin/disks/#{@disk.id}", headers: @headers
          assert_response :unprocessable_entity
          assert_match "Cannot delete disk with associated movies", response.body
        end

        test "DELETE destroy succeeds when disk has no movies" do
          delete "/api/v1/admin/disks/#{@disk.id}", headers: @headers
          assert_response :ok
          assert_not Disk.exists?(@disk.id)
        end
      end
    end
  end
end
