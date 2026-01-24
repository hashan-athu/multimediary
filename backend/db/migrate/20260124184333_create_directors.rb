class CreateDirectors < ActiveRecord::Migration[8.1]
  def change
    create_table :directors do |t|
      t.string :first_name
      t.string :last_name
      t.date :date_of_birth
      t.string :image_url
      t.timestamps
    end
  end
end
