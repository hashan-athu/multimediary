# frozen_string_literal: true

class GenreSerializer < Blueprinter::Base
  identifier :id
  fields :name, :description
end
