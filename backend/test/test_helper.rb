ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

require "support/auth_helpers"

module ActiveSupport
  class TestCase
    self.use_transactional_tests = true

    include FactoryBot::Syntax::Methods
  end
end

module ActionDispatch
  class IntegrationTest
    self.use_transactional_tests = true

    include FactoryBot::Syntax::Methods
    include AuthHelpers
  end
end
