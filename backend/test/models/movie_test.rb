require "test_helper"

class MovieTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:movie).valid?
  end

  test "invalid without name" do
    assert_not build(:movie, name: nil).valid?
  end

  test "invalid with year before 1888" do
    assert_not build(:movie, year: 1887).valid?
  end

  test "valid with nil year" do
    assert build(:movie, year: nil).valid?
  end

  test "belongs to category" do
    movie = build(:movie)
    assert_respond_to movie, :category
  end

  test "belongs to director" do
    movie = build(:movie)
    assert_respond_to movie, :director
  end

  test "belongs to disk" do
    movie = build(:movie)
    assert_respond_to movie, :disk
  end

  test "has_and_belongs_to_many actors" do
    movie = create(:movie)
    actor = create(:actor)
    movie.actors << actor
    assert_includes movie.actors, actor
  end

  test "has_and_belongs_to_many genres" do
    movie = create(:movie)
    genre = create(:genre)
    movie.genres << genre
    assert_includes movie.genres, genre
  end

  test "has_and_belongs_to_many qualities" do
    movie = create(:movie)
    quality = create(:quality)
    movie.qualities << quality
    assert_includes movie.qualities, quality
  end
end
