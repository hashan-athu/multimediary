class Genre < ApplicationRecord
  has_and_belongs_to_many :movies

  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }
end
