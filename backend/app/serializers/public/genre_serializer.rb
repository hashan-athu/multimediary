# frozen_string_literal: true

module Public
  class GenreSerializer < Blueprinter::Base
    identifier :id
    fields :name, :description
  end
end
