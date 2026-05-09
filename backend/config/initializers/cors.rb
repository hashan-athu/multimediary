# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")

    resource "/api/*",
             headers: :any,
             methods: [ :get, :post, :patch, :put, :delete, :options, :head ],
             expose: [ "Authorization" ],
             max_age: 600
  end
end
