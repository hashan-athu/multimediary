# frozen_string_literal: true

class UserSerializer < Blueprinter::Base
  identifier :id
  fields :email, :role, :created_at
end
