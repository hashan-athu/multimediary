class Director < ApplicationRecord
  has_many :movies

  validates :first_name, presence: true, length: { maximum: 100 }
  validates :last_name, presence: true, length: { maximum: 100 }

  def self.ransackable_attributes(_auth_object = nil)
    %w[first_name last_name]
  end

  def self.ransackable_associations(_auth_object = nil)
    []
  end
end
