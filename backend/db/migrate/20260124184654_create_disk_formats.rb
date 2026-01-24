class CreateDiskFormats < ActiveRecord::Migration[8.1]
  def change
    create_table :disk_formats do |t|
      t.string :name

      t.timestamps
    end
  end
end
