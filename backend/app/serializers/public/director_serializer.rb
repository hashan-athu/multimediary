# frozen_string_literal: true

module Public
  class DirectorSerializer < Blueprinter::Base
    identifier :id
    fields :first_name, :last_name, :date_of_birth, :image_url

    field :full_name do |director|
      "#{director.first_name} #{director.last_name}".strip
    end
  end
end
