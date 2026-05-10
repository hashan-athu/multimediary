# frozen_string_literal: true

module Public
  class ReviewerSerializer < Blueprinter::Base
    identifier :id
    fields :name, :website_url
  end
end
