# frozen_string_literal: true

module Public
  class CategorySerializer < Blueprinter::Base
    identifier :id
    fields :name, :description, :image_url
  end
end
