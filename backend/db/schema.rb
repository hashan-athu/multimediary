# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_25_074509) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "actors", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date_of_birth"
    t.string "first_name"
    t.string "gender"
    t.string "image_url"
    t.string "last_name"
    t.string "nationality"
    t.datetime "updated_at", null: false
  end

  create_table "actors_movies", id: false, force: :cascade do |t|
    t.bigint "actor_id", null: false
    t.bigint "movie_id", null: false
    t.index ["actor_id", "movie_id"], name: "index_actors_movies_on_actor_id_and_movie_id"
    t.index ["movie_id", "actor_id"], name: "index_actors_movies_on_movie_id_and_actor_id"
  end

  create_table "categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "directors", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date_of_birth"
    t.string "first_name"
    t.string "image_url"
    t.string "last_name"
    t.datetime "updated_at", null: false
  end

  create_table "disk_formats", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "disks", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "disk_format_id", null: false
    t.string "name"
    t.string "storage_type"
    t.datetime "updated_at", null: false
    t.index ["disk_format_id"], name: "index_disks_on_disk_format_id"
  end

  create_table "genres", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "description"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "genres_movies", id: false, force: :cascade do |t|
    t.bigint "genre_id", null: false
    t.bigint "movie_id", null: false
    t.index ["genre_id", "movie_id"], name: "index_genres_movies_on_genre_id_and_movie_id"
    t.index ["movie_id", "genre_id"], name: "index_genres_movies_on_movie_id_and_genre_id"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "exp"
    t.string "jti"
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "movies", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.string "country"
    t.datetime "created_at", null: false
    t.string "description"
    t.bigint "director_id", null: false
    t.bigint "disk_id", null: false
    t.string "file_size"
    t.string "language"
    t.string "name"
    t.string "poster_url"
    t.string "runtime"
    t.text "story"
    t.string "tagline"
    t.datetime "updated_at", null: false
    t.string "version"
    t.integer "year"
    t.index ["category_id"], name: "index_movies_on_category_id"
    t.index ["director_id"], name: "index_movies_on_director_id"
    t.index ["disk_id"], name: "index_movies_on_disk_id"
  end

  create_table "movies_qualities", id: false, force: :cascade do |t|
    t.bigint "movie_id", null: false
    t.bigint "quality_id", null: false
    t.index ["movie_id", "quality_id"], name: "index_movies_qualities_on_movie_id_and_quality_id"
    t.index ["quality_id", "movie_id"], name: "index_movies_qualities_on_quality_id_and_movie_id"
  end

  create_table "movies_ratings", id: false, force: :cascade do |t|
    t.bigint "movie_id", null: false
    t.bigint "rating_id", null: false
    t.index ["movie_id", "rating_id"], name: "index_movies_ratings_on_movie_id_and_rating_id"
    t.index ["rating_id", "movie_id"], name: "index_movies_ratings_on_rating_id_and_movie_id"
  end

  create_table "qualities", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "ratings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "rating_out_of"
    t.string "rating_value"
    t.bigint "reviewer_id", null: false
    t.datetime "updated_at", null: false
    t.index ["reviewer_id"], name: "index_ratings_on_reviewer_id"
  end

  create_table "reviewers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
    t.string "website_url"
  end

  create_table "users", force: :cascade do |t|
    t.text "active_token"
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "last_sign_in_at"
    t.string "last_sign_in_ip"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.string "role"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "disks", "disk_formats"
  add_foreign_key "movies", "categories"
  add_foreign_key "movies", "directors"
  add_foreign_key "movies", "disks"
  add_foreign_key "ratings", "reviewers"
end
