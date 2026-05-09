require "test_helper"

class QualityTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:quality).valid?
  end

  test "invalid without name" do
    assert_not build(:quality, name: nil).valid?
  end

  test "invalid with duplicate name" do
    create(:quality, name: "HD")
    duplicate = build(:quality, name: "HD")
    assert_not duplicate.valid?
  end

  test "has_and_belongs_to_many movies" do
    quality = create(:quality)
    movie = create(:movie)
    quality.movies << movie
    assert_includes quality.movies, movie
  end
end
