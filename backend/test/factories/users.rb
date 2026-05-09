FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    role { "editor" }

    trait :super_admin do
      role { "super_admin" }
    end

    trait :admin do
      role { "admin" }
    end

    trait :analyst do
      role { "analyst" }
    end
  end
end
