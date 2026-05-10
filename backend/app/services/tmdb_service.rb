# frozen_string_literal: true

class TmdbService
  BASE_URL = "https://api.themoviedb.org/3/"
  IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

  class TmdbError < StandardError; end

  def initialize
    @conn = Faraday.new(url: BASE_URL) do |f|
      f.request :retry, max: 3, interval: 0.5, exceptions: [ Faraday::TimeoutError, Faraday::ConnectionFailed ]
      f.response :json
      f.adapter Faraday.default_adapter
    end
    @api_key = ENV.fetch("TMDB_API_KEY")
  end

  # Search movies by title. Returns array of result hashes.
  def search(query)
    response = get("search/movie", query: query)
    response["results"] || []
  end

  # Fetch full movie detail by TMDb ID.
  def movie_detail(tmdb_id)
    data = get("movie/#{tmdb_id}", append_to_response: "credits")

    {
      name: data["title"],
      year: parse_year(data["release_date"]),
      description: data["overview"],
      tagline: data["tagline"],
      runtime: data["runtime"],
      language: data.dig("spoken_languages", 0, "english_name"),
      country: data.dig("production_countries", 0, "name"),
      poster_url: build_poster_url(data["poster_path"]),
      tmdb_id: data["id"],
      genres: extract_genres(data["genres"]),
      director: extract_director(data["credits"]),
      actors: extract_actors(data["credits"])
    }
  end

  private

  def get(path, params = {})
    response = @conn.get(path, params.merge(api_key: @api_key))
    raise TmdbError, "TMDb API error: #{response.status}" unless response.success?
    response.body
  rescue Faraday::Error => e
    raise TmdbError, "TMDb connection error: #{e.message}"
  end

  def parse_year(date_string)
    Date.parse(date_string).year if date_string.present?
  rescue Date::Error
    nil
  end

  def build_poster_url(path)
    "#{IMAGE_BASE_URL}#{path}" if path.present?
  end

  def extract_genres(genres_data)
    (genres_data || []).map { |g| g["name"] }
  end

  def extract_director(credits)
    crew = credits&.dig("crew") || []
    director = crew.find { |c| c["job"] == "Director" }
    return nil unless director
    { first_name: director["name"].split.first, last_name: director["name"].split[1..].join(" ") }
  end

  def extract_actors(credits)
    cast = credits&.dig("cast") || []
    cast.first(10).map do |c|
      {
        first_name: c["name"].split.first,
        last_name: c["name"].split[1..].join(" "),
        image_url: build_poster_url(c["profile_path"])
      }
    end
  end
end
