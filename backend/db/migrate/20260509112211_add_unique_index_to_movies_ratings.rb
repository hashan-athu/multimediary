class AddUniqueIndexToMoviesRatings < ActiveRecord::Migration[8.1]
  def change
    unless column_exists?(:ratings, :movie_id)
      add_reference :ratings, :movie, null: true, foreign_key: true, index: true
    end

    add_index :ratings, [ :movie_id, :reviewer_id ], unique: true,
              name: "index_ratings_on_movie_id_and_reviewer_id",
              if_not_exists: true
  end
end
