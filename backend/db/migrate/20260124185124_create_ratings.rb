class CreateRatings < ActiveRecord::Migration[8.1]
  def change
    create_table :ratings do |t|
      t.string :rating_value
      t.string :rating_out_of
      t.timestamps
    end
  end
end
