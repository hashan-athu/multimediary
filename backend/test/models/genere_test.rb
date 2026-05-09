require "test_helper"

class GenereTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:genre).valid?
  end

  test "invalid without name" do
    genre = build(:genre, name: nil)
    assert_not genre.valid?
    assert_includes genre.errors[:name], "can't be blank"
  end

  test "invalid with duplicate name" do
    create(:genre, name: "Action")
    duplicate = build(:genre, name: "Action")
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:name], "has already been taken"
  end

  test "has_and_belongs_to_many movies" do
    genre = create(:genre)
    movie = create(:movie)
    genre.movies << movie
    assert_includes genre.movies, movie
  end
end
