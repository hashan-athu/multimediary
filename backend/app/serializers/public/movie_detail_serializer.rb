# frozen_string_literal: true

module Public
  class MovieDetailSerializer < Blueprinter::Base
    identifier :id

    fields :name, :year, :language, :country, :runtime,
           :poster_url, :tagline, :description, :story, :version, :tmdb_id

    field :file_size do |movie|
      movie.file_size.to_f
    end

    association :category,  blueprint: Public::CategorySerializer
    association :genres,    blueprint: Public::GenreSerializer
    association :qualities, blueprint: Public::QualitySerializer
    association :ratings,   blueprint: Public::RatingSerializer
    association :director,  blueprint: Public::DirectorSerializer
    association :actors,    blueprint: Public::ActorSerializer

    field :disk do |movie|
      next nil unless movie.disk
      {
        id:           movie.disk.id,
        name:         movie.disk.name,
        storage_type: movie.disk.storage_type,
        format:       movie.disk.disk_format&.name
      }
    end

    field :average_rating do |movie|
      ratings = movie.ratings.to_a
      next nil if ratings.empty?
      normalised = ratings.map { |r| (r.rating_value.to_f / r.rating_out_of.to_f) * 10 }
      (normalised.sum / normalised.size).round(1)
    end
  end
end
