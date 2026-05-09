require "test_helper"

class DiskFormatTest < ActiveSupport::TestCase
  test "valid factory" do
    assert build(:disk_format).valid?
  end

  test "invalid without name" do
    assert_not build(:disk_format, name: nil).valid?
  end

  test "invalid with duplicate name" do
    create(:disk_format, name: "DVD")
    duplicate = build(:disk_format, name: "DVD")
    assert_not duplicate.valid?
  end

  test "has many disks" do
    fmt = create(:disk_format)
    disk = create(:disk, disk_format: fmt)
    assert_includes fmt.disks, disk
  end
end
