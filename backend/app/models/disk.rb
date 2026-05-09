class Disk < ApplicationRecord
  belongs_to :disk_format
  has_many :movies

  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }
  validates :storage_type, presence: true

  def self.ransackable_attributes(_auth_object = nil)
    %w[name storage_type]
  end
end
