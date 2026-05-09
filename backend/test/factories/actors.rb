FactoryBot.define do
  factory :actor do
    sequence(:first_name) { |n| "Actor#{n}" }
    last_name { "Doe" }
  end
end
