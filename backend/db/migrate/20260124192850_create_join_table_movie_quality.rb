class CreateJoinTableMovieQuality < ActiveRecord::Migration[8.1]
  def change
    create_join_table :movies, :qualities do |t|
      t.index [:movie_id, :quality_id]
     t.index [:quality_id, :movie_id]
    end
  end
end
