class DiskFormat < ApplicationRecord
  has_many :disks

  validates :name, presence: true, uniqueness: true, length: { maximum: 50 }
end
