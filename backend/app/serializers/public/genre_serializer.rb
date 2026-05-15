# frozen_string_literal: true

module Public
  class GenreSerializer < Blueprinter::Base
    identifier :id
    fields :name, :description, :image_url
  end
end
