class Reviewer < ApplicationRecord
  has_many :ratings, dependent: :destroy

  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }
  validates :website_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) }, allow_nil: true
end
