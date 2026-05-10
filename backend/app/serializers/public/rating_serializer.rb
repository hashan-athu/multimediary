# frozen_string_literal: true

module Public
  class RatingSerializer < Blueprinter::Base
    identifier :id
    fields :rating_value, :rating_out_of
    association :reviewer, blueprint: Public::ReviewerSerializer

    field :normalised do |rating|
      ((rating.rating_value.to_f / rating.rating_out_of.to_f) * 10).round(1)
    end
  end
end
