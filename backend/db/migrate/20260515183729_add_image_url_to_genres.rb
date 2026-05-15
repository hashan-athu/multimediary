class AddImageUrlToGenres < ActiveRecord::Migration[8.1]
  def change
    add_column :genres, :image_url, :string
  end
end
