require "test_helper"

class RatingTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:rating).valid?
  end

  test "invalid without reviewer" do
    assert_not build(:rating, reviewer: nil).valid?
  end

  test "invalid without rating_value" do
    assert_not build(:rating, rating_value: nil).valid?
  end

  test "invalid without rating_out_of" do
    assert_not build(:rating, rating_out_of: nil).valid?
  end

  test "belongs to reviewer" do
    rating = create(:rating)
    assert_not_nil rating.reviewer
  end
end
