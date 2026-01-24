class RenameDiskTypeColumn < ActiveRecord::Migration[8.1]
  def change
    rename_column :disks, :type, :storage_type
  end
end
