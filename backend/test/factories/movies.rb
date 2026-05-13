FactoryBot.define do
  factory :movie do
    sequence(:name) { |n| "Movie #{n}" }
    year { 2020 }
    tmdb_id { nil }
    association :disk
    association :category
    association :director

    trait :with_poster do
      poster_url { "https://image.tmdb.org/t/p/w500/example.jpg" }
    end

    trait :with_backdrop do
      backdrop_url { "https://image.tmdb.org/t/p/w1280/example.jpg" }
    end
  end
end
