# frozen_string_literal: true

class DiskSerializer < Blueprinter::Base
  identifier :id

  view :compact do
    fields :name, :storage_type
    association :disk_format, blueprint: DiskFormatSerializer
  end

  view :detail do
    include_view :compact
    field :movie_count do |disk|
      disk.movies.count
    end
    association :movies, blueprint: MovieSerializer, view: :list
  end
end
