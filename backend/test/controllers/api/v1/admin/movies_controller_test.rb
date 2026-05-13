require "test_helper"

module Api
  module V1
    module Admin
      class MoviesControllerTest < ActionDispatch::IntegrationTest
        setup do
          @admin = create(:user, :admin)
          @headers = auth_headers_for(@admin)
          @disk = create(:disk)
          @category = create(:category)
          @director = create(:director)
          @movie = create(:movie, disk: @disk, category: @category, director: @director)
        end

        test "GET index returns 200 with pagination meta" do
          get "/api/v1/admin/movies", headers: @headers
          assert_response :ok
          body = JSON.parse(response.body)
          assert body.key?("movies")
          assert body.key?("meta")
          assert body["meta"].key?("current_page")
          assert body["meta"].key?("total_pages")
          assert body["meta"].key?("total_count")
        end

        test "GET show returns 200 with full detail" do
          get "/api/v1/admin/movies/#{@movie.id}", headers: @headers
          assert_response :ok
          body = JSON.parse(response.body)
          assert_equal @movie.id, body["movie"]["id"]
        end

        test "POST create returns 201 on valid params" do
          post "/api/v1/admin/movies", headers: @headers, params: {
            movie: {
              name: "New Movie",
              year: 2021,
              disk_id: @disk.id,
              category_id: @category.id,
              director_id: @director.id
            }
          }, as: :json
          assert_response :created
          assert_equal "New Movie", JSON.parse(response.body).dig("movie", "name")
        end

        test "POST create returns 422 on missing name" do
          post "/api/v1/admin/movies", headers: @headers, params: {
            movie: { year: 2021, disk_id: @disk.id, category_id: @category.id, director_id: @director.id }
          }, as: :json
          assert_response :unprocessable_entity
        end

        test "PATCH update returns 200 on valid params" do
          patch "/api/v1/admin/movies/#{@movie.id}", headers: @headers, params: {
            movie: { name: "Updated Title" }
          }, as: :json
          assert_response :ok
          assert_equal "Updated Title", JSON.parse(response.body).dig("movie", "name")
        end

        test "DELETE destroy requires admin role" do
          analyst = create(:user, :analyst)
          analyst_headers = auth_headers_for(analyst)
          delete "/api/v1/admin/movies/#{@movie.id}", headers: analyst_headers
          assert_response :forbidden
        end

        test "DELETE destroy succeeds for admin" do
          delete "/api/v1/admin/movies/#{@movie.id}", headers: @headers
          assert_response :ok
          assert_not Movie.exists?(@movie.id)
        end

        test "GET index requires authentication" do
          get "/api/v1/admin/movies"
          assert_response :unauthorized
        end

        # ── TMDb action tests (TmdbService is mocked — no real HTTP calls) ──

        def with_tmdb_search_stub(results = [])
          fake = Object.new
          fake.define_singleton_method(:search) { |_q| results }
          original = TmdbService.method(:new)
          TmdbService.define_singleton_method(:new) { fake }
          yield
        ensure
          TmdbService.define_singleton_method(:new, &original)
        end

        def with_tmdb_import_stub(data = {})
          fake = Object.new
          fake.define_singleton_method(:movie_detail) { |_id| data }
          original = TmdbService.method(:new)
          TmdbService.define_singleton_method(:new) { fake }
          yield
        ensure
          TmdbService.define_singleton_method(:new, &original)
        end

        test "tmdb_search returns results" do
          results = [ { "id" => 1, "title" => "Inception", "release_date" => "2010-07-16" } ]
          with_tmdb_search_stub(results) do
            post tmdb_search_api_v1_admin_movies_url,
                 params: { query: "Inception" },
                 headers: @headers,
                 as: :json
            assert_response :ok
            assert_equal 1, JSON.parse(response.body)["results"].size
          end
        end

        test "tmdb_search requires query param" do
          post tmdb_search_api_v1_admin_movies_url,
               params: {},
               headers: @headers,
               as: :json
          assert_response :bad_request
        end

        test "tmdb_import creates movie from TMDb data" do
          data = {
            name: "Inception", year: 2010, description: "A thief...",
            tagline: "Your mind is the scene", runtime: 148,
            language: "English", country: "USA",
            poster_url: "https://example.com/p.jpg",
            backdrop_url: "https://example.com/b.jpg",
            tmdb_id: 27205, genres: [ "Action", "Sci-Fi" ],
            director: { first_name: "Christopher", last_name: "Nolan" },
            actors: [ { first_name: "Leonardo", last_name: "DiCaprio", image_url: nil } ]
          }

          with_tmdb_import_stub(data) do
            post tmdb_import_api_v1_admin_movies_url,
                 params: { tmdb_id: "27205", disk_id: @disk.id, category_id: @category.id },
                 headers: @headers,
                 as: :json
            assert_response :created
            movie = JSON.parse(response.body)["movie"]
            assert_equal "Inception", movie["name"]
            assert_equal "https://example.com/b.jpg", movie["backdrop_url"]
            assert Movie.exists?(tmdb_id: 27205)
          end
        end

        test "tmdb_import returns 409 if movie already imported" do
          create(:movie, tmdb_id: 27205)

          post tmdb_import_api_v1_admin_movies_url,
               params: { tmdb_id: "27205", disk_id: @disk.id, category_id: @category.id },
               headers: @headers,
               as: :json
          assert_response :conflict
        end
      end
    end
  end
end
