FactoryBot.define do
  factory :quality do
    sequence(:name) { |n| "Quality #{n}" }
  end
end
