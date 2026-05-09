# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DashboardsController < BaseController
        def show
          authorize! :read, :dashboard

          render_success({
            stats: {
              movies: {
                total:        Movie.count,
                by_category:  movies_by_category,
                by_format:    movies_by_format,
                without_disk: Movie.where(disk_id: nil).count
              },
              disks: {
                total:     Disk.count,
                by_format: disks_by_format
              },
              people: {
                actors:    Actor.count,
                directors: Director.count
              },
              storage: {
                total_gb: Movie.where.not(file_size: [ nil, "" ])
                               .pluck(:file_size)
                               .sum(&:to_f)
                               .round(2)
              }
            },
            recent_movies: MovieSerializer.render_as_hash(
              Movie.includes(:category, :disk, :genres)
                   .order(created_at: :desc)
                   .limit(8),
              view: :list
            )
          })
        end

        private

        def movies_by_category
          Movie.joins(:category)
               .group("categories.name")
               .count
               .map { |name, count| { name: name, count: count } }
        end

        def movies_by_format
          Movie.joins(disk: :disk_format)
               .group("disk_formats.name")
               .count
               .map { |name, count| { name: name, count: count } }
        end

        def disks_by_format
          Disk.joins(:disk_format)
              .group("disk_formats.name")
              .count
              .map { |name, count| { name: name, count: count } }
        end
      end
    end
  end
end
