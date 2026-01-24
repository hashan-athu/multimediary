class AddDiskFormatToDisk < ActiveRecord::Migration[8.1]
  def change
    add_reference :disks, :disk_format, null: false, foreign_key: true
  end
end
