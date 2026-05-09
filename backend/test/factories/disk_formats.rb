FactoryBot.define do
  factory :disk_format do
    sequence(:name) { |n| "Format #{n}" }
  end
end
