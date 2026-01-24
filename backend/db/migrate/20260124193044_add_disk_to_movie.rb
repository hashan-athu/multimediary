class AddDiskToMovie < ActiveRecord::Migration[8.1]
  def change
    add_reference :movies, :disk, null: false, foreign_key: true
  end
end
