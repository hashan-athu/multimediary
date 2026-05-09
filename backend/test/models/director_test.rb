require "test_helper"

class DirectorTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:director).valid?
  end

  test "invalid without first_name" do
    assert_not build(:director, first_name: nil).valid?
  end

  test "invalid without last_name" do
    assert_not build(:director, last_name: nil).valid?
  end

  test "has many movies" do
    director = create(:director)
    movie = create(:movie, director: director)
    assert_includes director.movies, movie
  end
end
