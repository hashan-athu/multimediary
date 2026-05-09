# frozen_string_literal: true

class Rack::Attack
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  throttle("admin/login", limit: 5, period: 1.minute) do |req|
    req.ip if req.path == "/api/v1/admin/login" && req.post?
  end

  throttle("api/general", limit: 300, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/api/")
  end

  self.throttled_responder = lambda do |_request|
    [
      429,
      { "Content-Type" => "application/json" },
      [ { error: "Too Many Requests", message: "Rate limit exceeded. Try again later." }.to_json ]
    ]
  end
end
