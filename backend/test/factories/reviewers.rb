FactoryBot.define do
  factory :reviewer do
    sequence(:name) { |n| "Reviewer #{n}" }
    website_url { nil }
  end
end
