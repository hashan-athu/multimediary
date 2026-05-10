# frozen_string_literal: true

module Public
  class ActorSerializer < Blueprinter::Base
    identifier :id
    fields :first_name, :last_name, :gender, :date_of_birth, :nationality, :image_url

    field :full_name do |actor|
      "#{actor.first_name} #{actor.last_name}".strip
    end
  end
end
