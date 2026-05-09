# frozen_string_literal: true

class CategorySerializer < Blueprinter::Base
  identifier :id
  fields :name
end
