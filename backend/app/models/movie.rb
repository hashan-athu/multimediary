class Movie < ApplicationRecord
  belongs_to :category
  belongs_to :director
  belongs_to :disk
  has_and_belongs_to_many :actors
  has_and_belongs_to_many :genres
  has_and_belongs_to_many :ratings
end
