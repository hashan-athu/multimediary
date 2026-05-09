class Rating < ApplicationRecord
  belongs_to :reviewer
  belongs_to :movie, optional: true

  has_and_belongs_to_many :movies

  validates :rating_value,  presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :rating_out_of, presence: true, numericality: { greater_than: 0 }
  validates :reviewer,      presence: true
  validates :reviewer_id,   uniqueness: { scope: :movie_id,
                                          message: "has already rated this movie" }
end
