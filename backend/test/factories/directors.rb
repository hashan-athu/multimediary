FactoryBot.define do
  factory :director do
    sequence(:first_name) { |n| "Director#{n}" }
    last_name { "Smith" }
  end
end
