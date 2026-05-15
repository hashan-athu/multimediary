class AllowNullDirectorOnMovies < ActiveRecord::Migration[8.1]
  def change
    change_column_null :movies, :director_id, true
  end
end
