# frozen_string_literal: true

class GenreSerializer < Blueprinter::Base
  identifier :id
  fields :name, :description, :image_url
end
