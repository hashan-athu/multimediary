require "test_helper"

class DiskTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:disk).valid?
  end

  test "invalid without name" do
    assert_not build(:disk, name: nil).valid?
  end

  test "invalid with duplicate name" do
    create(:disk, name: "Main Disk")
    duplicate = build(:disk, name: "Main Disk")
    assert_not duplicate.valid?
  end

  test "invalid without storage_type" do
    assert_not build(:disk, storage_type: nil).valid?
  end

  test "belongs to disk_format" do
    disk = build(:disk)
    assert_respond_to disk, :disk_format
  end

  test "has many movies" do
    disk = create(:disk)
    movie = create(:movie, disk: disk)
    assert_includes disk.movies, movie
  end
end
