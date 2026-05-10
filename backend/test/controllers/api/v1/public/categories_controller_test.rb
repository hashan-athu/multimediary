# frozen_string_literal: true

require "test_helper"

class Api::V1::Public::CategoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @category = create(:category)
    @movie    = create(:movie, category: @category)
  end

  test "lists categories with movie counts" do
    get api_v1_public_categories_url
    assert_response :ok
    cats = JSON.parse(response.body)["categories"]
    cat  = cats.find { |c| c["id"] == @category.id }
    assert_not_nil cat
    assert cat["movie_count"] >= 1
  end

  test "shows category with its movies" do
    get api_v1_public_category_url(@category)
    assert_response :ok
    json = JSON.parse(response.body)
    assert json.key?("category")
    assert json.key?("movies")
    assert json.key?("meta")
  end

  test "returns 404 for unknown category" do
    get api_v1_public_category_url(id: 0)
    assert_response :not_found
  end
end
