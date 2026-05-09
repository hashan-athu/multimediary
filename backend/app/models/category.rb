class Category < ApplicationRecord
  has_many :movies

  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }
end
