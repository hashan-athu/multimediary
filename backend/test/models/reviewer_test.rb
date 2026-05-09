require "test_helper"

class ReviewerTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:reviewer).valid?
  end

  test "invalid without name" do
    assert_not build(:reviewer, name: nil).valid?
  end

  test "invalid with duplicate name" do
    create(:reviewer, name: "Rotten Tomatoes")
    duplicate = build(:reviewer, name: "Rotten Tomatoes")
    assert_not duplicate.valid?
  end

  test "invalid with malformed website_url" do
    assert_not build(:reviewer, website_url: "not-a-url").valid?
  end

  test "valid with nil website_url" do
    assert build(:reviewer, website_url: nil).valid?
  end

  test "valid with https url" do
    assert build(:reviewer, website_url: "https://rottentomatoes.com").valid?
  end

  test "has many ratings" do
    reviewer = create(:reviewer)
    rating = create(:rating, reviewer: reviewer)
    assert_includes reviewer.ratings, rating
  end
end
