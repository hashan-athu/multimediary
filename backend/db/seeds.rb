# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Seeding data..."

# 1. Categories
action_category = Category.find_or_create_by!(name: "Action")
puts "Created/Found Category: Action"

# 2. DiskFormats
dvd_format = DiskFormat.find_or_create_by!(name: "DVD")
puts "Created/Found DiskFormat: DVD"

# 3. Disks
storage_disk = Disk.find_or_create_by!(name: "Movie Storage 1") do |disk|
  disk.disk_format = dvd_format
  disk.storage_type = "HDD" # Assuming type column is string based on schema
end
puts "Created/Found Disk: Movie Storage 1"

# 4. Genres
action_genre = Genre.find_or_create_by!(name: "Action")
thriller_genre = Genre.find_or_create_by!(name: "Thriller")
crime_genre = Genre.find_or_create_by!(name: "Crime")
puts "Created/Found Genres"

# 5. Directors
rob_cohen = Director.find_or_create_by!(first_name: "Rob", last_name: "Cohen")
john_singleton = Director.find_or_create_by!(first_name: "John", last_name: "Singleton")
justin_lin = Director.find_or_create_by!(first_name: "Justin", last_name: "Lin")
puts "Created/Found Directors"

# 6. Actors
vin_diesel = Actor.find_or_create_by!(first_name: "Vin", last_name: "Diesel")
paul_walker = Actor.find_or_create_by!(first_name: "Paul", last_name: "Walker")
michelle_rodriguez = Actor.find_or_create_by!(first_name: "Michelle", last_name: "Rodriguez")
jordana_brewster = Actor.find_or_create_by!(first_name: "Jordana", last_name: "Brewster")
tyrese_gibson = Actor.find_or_create_by!(first_name: "Tyrese", last_name: "Gibson")
ludacris = Actor.find_or_create_by!(first_name: "Chris", last_name: "Bridges") # Ludacris
sung_kang = Actor.find_or_create_by!(first_name: "Sung", last_name: "Kang")
gal_gadot = Actor.find_or_create_by!(first_name: "Gal", last_name: "Gadot")
dwayne_johnson = Actor.find_or_create_by!(first_name: "Dwayne", last_name: "Johnson")
lucas_black = Actor.find_or_create_by!(first_name: "Lucas", last_name: "Black")

puts "Created/Found Actors"

# Helper to create movie
def create_movie(title, year, director, category, disk, actors, genres, description)
  movie = Movie.find_or_create_by!(name: title) do |m|
    m.year = year
    m.director = director
    m.category = category
    m.disk = disk
    m.description = description
    m.language = "English"
  end
  
  # Update associations ensuring no duplicates
  movie.actors = (movie.actors + actors).uniq
  movie.genres = (movie.genres + genres).uniq
  movie.save!
  puts "Seeded Movie: #{title}"
end

# Movie 1: The Fast and the Furious (2001)
create_movie(
  "The Fast and the Furious", 2001, rob_cohen, action_category, storage_disk,
  [vin_diesel, paul_walker, michelle_rodriguez, jordana_brewster],
  [action_genre, crime_genre, thriller_genre],
  "Los Angeles police officer Brian O'Conner must decide where his loyalty really lies when he becomes enamored with the street racing world he has been sent undercover to destroy."
)

# Movie 2: 2 Fast 2 Furious (2003)
create_movie(
  "2 Fast 2 Furious", 2003, john_singleton, action_category, storage_disk,
  [paul_walker, tyrese_gibson, ludacris],
  [action_genre, crime_genre, thriller_genre],
  "Former cop Brian O'Conner is called upon to bust a dangerous criminal and he recruits the help of a former childhood friend and street racer who has a chance to redeem himself."
)

# Movie 3: The Fast and the Furious: Tokyo Drift (2006)
create_movie(
  "The Fast and the Furious: Tokyo Drift", 2006, justin_lin, action_category, storage_disk,
  [lucas_black, sung_kang],
  [action_genre, crime_genre, thriller_genre],
  "A teenager becomes a major competitor in the world of drift racing after moving with his father in Tokyo to avoid a jail sentence in America."
)

# Movie 4: Fast & Furious (2009)
create_movie(
  "Fast & Furious", 2009, justin_lin, action_category, storage_disk,
  [vin_diesel, paul_walker, michelle_rodriguez, jordana_brewster, sung_kang, gal_gadot],
  [action_genre, crime_genre, thriller_genre],
  "Brian O'Conner, back working for the FBI in Los Angeles, teams up with Dominic Toretto to bring down a heroin importer by infiltrating his operation."
)

# Movie 5: Fast Five (2011)
create_movie(
  "Fast Five", 2011, justin_lin, action_category, storage_disk,
  [vin_diesel, paul_walker, jordana_brewster, tyrese_gibson, ludacris, sung_kang, gal_gadot, dwayne_johnson],
  [action_genre, crime_genre, thriller_genre],
  "Dominic Toretto and his crew of street racers plan a massive heist to buy their freedom while in the sights of a powerful Brazilian drug lord and a dangerous federal agent."
)

# Movie 6: Fast & Furious 6 (2013)
create_movie(
  "Fast & Furious 6", 2013, justin_lin, action_category, storage_disk,
  [vin_diesel, paul_walker, michelle_rodriguez, jordana_brewster, tyrese_gibson, ludacris, sung_kang, gal_gadot, dwayne_johnson],
  [action_genre, crime_genre, thriller_genre],
  "Hobbs has Dominic and Brian reassemble their crew to take down a team of mercenaries: Dominic unexpectedly gets sidetracked with facing his presumed deceased girlfriend, Letty."
)

puts "Seeding completed successfully!"
