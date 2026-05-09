class Quality < ApplicationRecord
  has_and_belongs_to_many :movies

  validates :name, presence: true, uniqueness: true, length: { maximum: 50 }
end
