class CreateMovies < ActiveRecord::Migration[8.1]
  def change
    create_table :movies do |t|
      t.string :name
      t.string :version
      t.string :tagline
      t.string :description
      t.integer :year
      t.string :poster_url
      t.text :story
      t.string :language
      t.string :country
      t.string :runtime
      t.string :file_size
      t.timestamps
    end
  end
end
