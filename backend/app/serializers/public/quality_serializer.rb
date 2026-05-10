# frozen_string_literal: true

module Public
  class QualitySerializer < Blueprinter::Base
    identifier :id
    fields :name
  end
end
