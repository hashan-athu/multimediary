class Disk < ApplicationRecord

  belongs_to :disk_format
  has_many :movies
end
