class AddReviewerToRating < ActiveRecord::Migration[8.1]
  def change
    add_reference :ratings, :reviewer, null: false, foreign_key: true
  end
end
