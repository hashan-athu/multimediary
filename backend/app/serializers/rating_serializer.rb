# frozen_string_literal: true

class RatingSerializer < Blueprinter::Base
  identifier :id
  fields :rating_value, :rating_out_of
  association :reviewer, blueprint: ReviewerSerializer
end
