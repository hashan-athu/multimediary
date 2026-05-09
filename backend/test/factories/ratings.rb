FactoryBot.define do
  factory :rating do
    rating_value  { 8.0 }
    rating_out_of { 10.0 }
    association :reviewer
    association :movie
  end
end
