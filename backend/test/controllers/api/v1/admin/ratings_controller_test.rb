# frozen_string_literal: true

require "test_helper"

class Api::V1::Admin::RatingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @editor   = create(:user, role: :editor)
    @movie    = create(:movie)
    @reviewer = create(:reviewer)
    @rating   = create(:rating, movie: @movie, reviewer: @reviewer)
  end

  test "lists ratings for a movie" do
    get api_v1_admin_movie_ratings_url(@movie), headers: auth_headers_for(@editor)
    assert_response :ok
    assert_equal 1, JSON.parse(response.body)["ratings"].size
  end

  test "creates a rating" do
    new_reviewer = create(:reviewer)
    post api_v1_admin_movie_ratings_url(@movie),
         params: { rating: { rating_value: 8.5, rating_out_of: 10,
                             reviewer_id: new_reviewer.id } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :created
  end

  test "cannot create duplicate rating from same reviewer" do
    post api_v1_admin_movie_ratings_url(@movie),
         params: { rating: { rating_value: 7, rating_out_of: 10,
                             reviewer_id: @reviewer.id } },
         headers: auth_headers_for(@editor),
         as: :json
    assert_response :unprocessable_entity
    assert_match "already rated", JSON.parse(response.body)["errors"].join
  end

  test "cannot update rating belonging to a different movie" do
    other_movie = create(:movie)
    patch api_v1_admin_movie_rating_url(other_movie, @rating),
          params: { rating: { rating_value: 5 } },
          headers: auth_headers_for(@editor),
          as: :json
    assert_response :not_found
  end

  test "destroys a rating" do
    delete api_v1_admin_movie_rating_url(@movie, @rating),
           headers: auth_headers_for(@editor)
    assert_response :ok
    assert_raises(ActiveRecord::RecordNotFound) { @rating.reload }
  end
end
