# frozen_string_literal: true

module Api
  module V1
    module Public
      class DisksController < BaseController
        # GET /api/v1/public/disks
        def index
          @disks = Disk.select(
            "disks.*",
            "disk_formats.name AS format_name",
            "COUNT(movies.id) AS movie_count"
          )
          .joins(:disk_format)
          .joins("LEFT JOIN movies ON movies.disk_id = disks.id")
          .group("disks.id, disk_formats.name")
          .having("COUNT(movies.id) > 0")
          .order("disks.name ASC")

          render json: {
            disks: @disks.map do |disk|
              {
                id:           disk.id,
                name:         disk.name,
                storage_type: disk.storage_type,
                format:       disk.format_name,
                movie_count:  disk.movie_count.to_i
              }
            end
          }
        end

        # GET /api/v1/public/disks/:id
        def show
          @disk   = Disk.includes(:disk_format).find(params[:id])
          @movies = Movie.includes(:category, :genres, :qualities)
                         .where(disk_id: @disk.id)
                         .order(name: :asc)

          render json: {
            disk: {
              id:           @disk.id,
              name:         @disk.name,
              storage_type: @disk.storage_type,
              format:       @disk.disk_format&.name,
              movie_count:  @movies.count
            },
            movies: ::Public::MovieCardSerializer.render_as_hash(@movies)
          }
        end
      end
    end
  end
end
