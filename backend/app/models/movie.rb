class Movie < ApplicationRecord
  belongs_to :category
  belongs_to :director
  belongs_to :disk

  validates :name, presence: true, length: { maximum: 255 }
  validates :year, numericality: { only_integer: true, greater_than: 1887, less_than_or_equal_to: Date.current.year + 2 }, allow_nil: true
  validates :runtime, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :file_size, numericality: { greater_than: 0 }, allow_nil: true
  validates :language, length: { maximum: 100 }, allow_nil: true
  validates :country, length: { maximum: 100 }, allow_nil: true
  validates :tmdb_id, uniqueness: true, allow_nil: true,
                      numericality: { only_integer: true, greater_than: 0 }
  has_and_belongs_to_many :actors
  has_and_belongs_to_many :genres
  has_and_belongs_to_many :ratings
  has_and_belongs_to_many :qualities

  def self.ransackable_attributes(_auth_object = nil)
    %w[name year language country description story tagline tmdb_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[category director genres actors disk]
  end
end
