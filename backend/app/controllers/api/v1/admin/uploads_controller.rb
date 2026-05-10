# frozen_string_literal: true

module Api
  module V1
    module Admin
      class UploadsController < BaseController
        ALLOWED_TYPES = %w[image/jpeg image/png image/webp image/gif].freeze
        MAX_SIZE_BYTES = 10 * 1024 * 1024

        def create
          authorize! :create, :upload

          file = params[:file]
          return render json: { error: "No file provided" }, status: :bad_request unless file
          return render json: { error: "File too large (max 10 MB)" }, status: :unprocessable_entity if file.size > MAX_SIZE_BYTES
          return render json: { error: "Only JPEG, PNG, WebP and GIF are allowed" }, status: :unprocessable_entity unless ALLOWED_TYPES.include?(file.content_type)

          uploads_dir = Rails.root.join("public", "uploads")
          FileUtils.mkdir_p(uploads_dir)

          ext      = File.extname(file.original_filename).downcase
          filename = "#{SecureRandom.uuid}#{ext}"
          dest     = uploads_dir.join(filename)
          FileUtils.cp(file.tempfile.path, dest)

          url = "#{request.base_url}/uploads/#{filename}"
          render json: { url: url }, status: :created
        end
      end
    end
  end
end
