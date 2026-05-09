class Actor < ApplicationRecord
  has_and_belongs_to_many :movies

  validates :first_name, presence: true, length: { maximum: 100 }
  validates :last_name, length: { maximum: 100 }, allow_nil: true
  validates :gender, inclusion: { in: %w[male female other] }, allow_nil: true

  def self.ransackable_attributes(_auth_object = nil)
    %w[first_name last_name nationality gender]
  end
end
