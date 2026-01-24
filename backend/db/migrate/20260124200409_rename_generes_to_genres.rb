class RenameGeneresToGenres < ActiveRecord::Migration[8.1]
  def change
    rename_table :generes, :genres
  end
end
