require "test_helper"

class ActorTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:actor).valid?
  end

  test "invalid without first_name" do
    assert_not build(:actor, first_name: nil).valid?
  end

  test "invalid with unknown gender" do
    assert_not build(:actor, gender: "unknown").valid?
  end

  test "valid with nil gender" do
    assert build(:actor, gender: nil).valid?
  end

  test "has_and_belongs_to_many movies" do
    actor = create(:actor)
    movie = create(:movie)
    actor.movies << movie
    assert_includes actor.movies, movie
  end
end
