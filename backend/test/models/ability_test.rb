# frozen_string_literal: true

require "test_helper"

class AbilityTest < ActiveSupport::TestCase
  test "super_admin can manage everything" do
    ability = Ability.new(create(:user, role: :super_admin))
    assert ability.can?(:manage, Movie)
    assert ability.can?(:destroy, User)
    assert ability.can?(:manage, :all)
  end

  test "admin can manage content but not destroy users" do
    ability = Ability.new(create(:user, role: :admin))
    assert ability.can?(:manage, Movie)
    assert ability.can?(:read, User)
    assert ability.cannot?(:destroy, User)
  end

  test "editor can manage content but not destroy lookup tables" do
    ability = Ability.new(create(:user, role: :editor))
    assert ability.can?(:create, Movie)
    assert ability.can?(:update, Genre)
    assert ability.cannot?(:destroy, Genre)
    assert ability.cannot?(:destroy, Category)
    assert ability.cannot?(:destroy, Quality)
    assert ability.cannot?(:destroy, Disk)
    assert ability.cannot?(:destroy, DiskFormat)
    assert ability.cannot?(:destroy, Reviewer)
  end

  test "analyst is read-only" do
    ability = Ability.new(create(:user, role: :analyst))
    assert ability.can?(:read, Movie)
    assert ability.cannot?(:create, Movie)
    assert ability.cannot?(:update, Movie)
    assert ability.cannot?(:destroy, Movie)
  end

  test "nil user has no abilities" do
    ability = Ability.new(nil)
    assert ability.cannot?(:read, Movie)
    assert ability.cannot?(:manage, :all)
  end
end
