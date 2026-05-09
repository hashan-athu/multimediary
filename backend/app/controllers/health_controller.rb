# frozen_string_literal: true

class HealthController < ApplicationController
  def show
    ActiveRecord::Base.connection.execute("SELECT 1")
    render json: { status: "ok", database: "ok", timestamp: Time.current.iso8601 }, status: :ok
  rescue => e
    render json: { status: "error", database: "unreachable", error: e.message },
           status: :service_unavailable
  end
end
