# frozen_string_literal: true

class MovieSerializer < Blueprinter::Base
  identifier :id

  view :list do
    fields :name, :year, :language, :country, :runtime, :file_size,
           :version, :poster_url, :tagline, :tmdb_id
    association :category, blueprint: CategorySerializer
    association :disk, blueprint: DiskSerializer, view: :compact
    association :genres, blueprint: GenreSerializer
    association :qualities, blueprint: QualitySerializer
  end

  view :detail do
    include_view :list
    fields :description, :story
    association :director, blueprint: DirectorSerializer
    association :actors, blueprint: ActorSerializer
    association :ratings, blueprint: RatingSerializer
  end
end
