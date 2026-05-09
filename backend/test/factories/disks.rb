FactoryBot.define do
  factory :disk do
    sequence(:name) { |n| "Disk #{n}" }
    storage_type { "HDD" }
    association :disk_format
  end
end
