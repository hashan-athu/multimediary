# frozen_string_literal: true

require "test_helper"

class HealthControllerTest < ActionDispatch::IntegrationTest
  test "health check returns ok with database status" do
    get rails_health_check_url
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal "ok", json["status"]
    assert_equal "ok", json["database"]
    assert json.key?("timestamp")
  end
end
