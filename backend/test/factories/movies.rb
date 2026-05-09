FactoryBot.define do
  factory :movie do
    sequence(:name) { |n| "Movie #{n}" }
    year { 2020 }
    tmdb_id { nil }
    association :disk
    association :category
    association :director
  end
end
