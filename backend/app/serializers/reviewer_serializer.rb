# frozen_string_literal: true

class ReviewerSerializer < Blueprinter::Base
  identifier :id
  fields :name, :website_url
end
