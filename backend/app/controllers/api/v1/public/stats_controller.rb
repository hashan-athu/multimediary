# frozen_string_literal: true

module Api
  module V1
    module Public
      class StatsController < BaseController
        # GET /api/v1/public/stats
        def show
          total_movies    = Movie.count
          total_disks     = Disk.joins(:movies).distinct.count
          total_actors    = Actor.joins(:movies).distinct.count
          total_directors = Director.joins(:movies).distinct.count

          by_category = Category.select(
            "categories.name",
            "COUNT(movies.id) AS count"
          )
          .joins("LEFT JOIN movies ON movies.category_id = categories.id")
          .group("categories.id")
          .having("COUNT(movies.id) > 0")
          .order("count DESC")
          .map { |c| { name: c.name, count: c.count.to_i } }

          by_format = DiskFormat.select(
            "disk_formats.name",
            "COUNT(DISTINCT movies.id) AS count"
          )
          .joins(disks: :movies)
          .group("disk_formats.id")
          .having("COUNT(DISTINCT movies.id) > 0")
          .order("count DESC")
          .map { |f| { name: f.name, count: f.count.to_i } }

          top_genres = Genre.select(
            "genres.name",
            "COUNT(DISTINCT genres_movies.movie_id) AS count"
          )
          .joins("LEFT JOIN genres_movies ON genres_movies.genre_id = genres.id")
          .group("genres.id")
          .having("COUNT(DISTINCT genres_movies.movie_id) > 0")
          .order("count DESC")
          .limit(10)
          .map { |g| { name: g.name, count: g.count.to_i } }

          year_range = Movie.where.not(year: nil)
          oldest = year_range.minimum(:year)
          newest = year_range.maximum(:year)

          total_gb = (Movie.pluck(:file_size).map(&:to_f).sum / 1024.0).round(1)

          render json: {
            totals: {
              movies:     total_movies,
              disks:      total_disks,
              actors:     total_actors,
              directors:  total_directors,
              storage_gb: total_gb,
              year_range: oldest && newest ? "#{oldest}–#{newest}" : nil
            },
            by_category: by_category,
            by_format:   by_format,
            top_genres:  top_genres
          }
        end
      end
    end
  end
end
