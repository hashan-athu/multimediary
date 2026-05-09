require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:category).valid?
  end

  test "invalid without name" do
    assert_not build(:category, name: nil).valid?
  end

  test "invalid with duplicate name" do
    create(:category, name: "Action")
    duplicate = build(:category, name: "Action")
    assert_not duplicate.valid?
  end

  test "has many movies" do
    category = create(:category)
    movie = create(:movie, category: category)
    assert_includes category.movies, movie
  end
end
