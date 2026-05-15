class AddDescriptionAndImageUrlToCategories < ActiveRecord::Migration[8.1]
  def change
    add_column :categories, :description, :string
    add_column :categories, :image_url, :string
  end
end
