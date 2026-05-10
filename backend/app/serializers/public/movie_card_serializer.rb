# frozen_string_literal: true

module Public
  class MovieCardSerializer < Blueprinter::Base
    identifier :id

    fields :name, :year, :language, :country, :runtime, :poster_url, :tagline

    field :file_size do |movie|
      movie.file_size.to_f
    end

    association :category,  blueprint: Public::CategorySerializer
    association :genres,    blueprint: Public::GenreSerializer
    association :qualities, blueprint: Public::QualitySerializer

    field :disk do |movie|
      next nil unless movie.disk
      {
        id:           movie.disk.id,
        name:         movie.disk.name,
        storage_type: movie.disk.storage_type,
        format:       movie.disk.disk_format&.name
      }
    end

    field :has_poster do |movie|
      movie.poster_url.present?
    end
  end
end
