# frozen_string_literal: true

module LegacyImporter
  SQL_PATH = Rails.root.join("../assets/ben_cinema_db.sql").freeze

  def self.parse_table(sql, table_name)
    columns = []
    rows = []
    in_block = false

    sql.each_line do |raw_line|
      line = raw_line.strip

      if line =~ /^INSERT INTO `#{Regexp.escape(table_name)}`\s+\(([^)]+)\)\s+VALUES\s*$/
        columns = ::Regexp.last_match(1).scan(/`(\w+)`/).flatten
        in_block = true
        next
      end

      next unless in_block

      if line.start_with?("(")
        # Strip trailing comma or semicolon, then remove outer parens
        row_str = line.delete_suffix(",").delete_suffix(";")
        row_str = row_str[1..-2] # strip ( and )
        values = parse_values(row_str)
        rows << columns.zip(values).to_h
      elsif line.start_with?(";") || line.empty?
        in_block = false
      end
    end

    rows
  end

  def self.parse_values(str)
    values = []
    i = 0

    while i < str.length
      i += 1 while i < str.length && str[i] =~ /\s/
      break if i >= str.length

      if str[i..i + 3] == "NULL"
        values << nil
        i += 4
      elsif str[i] == "'"
        j = i + 1
        buf = +""
        while j < str.length
          if str[j] == '\\' && j + 1 < str.length
            buf << str[j + 1]
            j += 2
          elsif str[j] == "'"
            j += 1
            break
          else
            buf << str[j]
            j += 1
          end
        end
        values << buf
        i = j
      else
        j = i
        j += 1 while j < str.length && str[j] =~ /[\d.\-]/
        values << str[i...j]
        i = j
      end

      i += 1 while i < str.length && str[i] =~ /[\s,]/
    end

    values
  end

  # "01:27:21" → 87 (minutes); returns nil for 0 or blank
  def self.to_minutes(time_str)
    return nil if time_str.blank?

    h, m, = time_str.split(":").map(&:to_i)
    total = h * 60 + m
    total.positive? ? total : nil
  end

  def self.titleize(str)
    str&.strip&.split&.map(&:capitalize)&.join(" ")
  end
end

namespace :import do
  desc "Import legacy ben_cinema_db.sql (MySQL/phpMyAdmin dump) into the current schema"
  task legacy: :environment do
    path = LegacyImporter::SQL_PATH
    abort "SQL file not found at #{path}" unless File.exist?(path)

    puts "Reading #{path}..."
    sql = File.read(path, encoding: "latin1:utf-8", undef: :replace, replace: "")

    puts "Parsing tables..."
    formats_data    = LegacyImporter.parse_table(sql, "formats")
    categories_data = LegacyImporter.parse_table(sql, "category")
    genres_data     = LegacyImporter.parse_table(sql, "genre")
    qualities_data  = LegacyImporter.parse_table(sql, "quality")
    reviewers_data  = LegacyImporter.parse_table(sql, "reveiwer")
    directors_data  = LegacyImporter.parse_table(sql, "director")
    disks_data      = LegacyImporter.parse_table(sql, "disks")
    actors_data     = LegacyImporter.parse_table(sql, "actor")
    years_data      = LegacyImporter.parse_table(sql, "years")
    films_data      = LegacyImporter.parse_table(sql, "films")
    direction_data  = LegacyImporter.parse_table(sql, "direction")
    cast_data       = LegacyImporter.parse_table(sql, "movie_cast")
    rating_data     = LegacyImporter.parse_table(sql, "rating")

    puts "Parsed: #{films_data.size} films, #{actors_data.size} actors, #{directors_data.size} directors, " \
         "#{disks_data.size} disks, #{cast_data.size} cast links, #{rating_data.size} ratings"

    # ── Pre-build lookup maps ─────────────────────────────────────────────────

    years_map = years_data.each_with_object({}) { |r, h| h[r["y_id"].to_i] = r["year"].to_i }

    # film_id → first director id (old schema allows many, we take the first)
    direction_map = {}
    direction_data.each do |r|
      direction_map[r["dir_movie_id"].to_i] ||= r["dir_dir_id"].to_i
    end

    # ID maps: old integer id → new AR id
    format_id_map   = {}
    category_id_map = {}
    genre_id_map    = {}
    quality_id_map  = {}
    reviewer_id_map = {}
    director_id_map = {}
    disk_id_map     = {}
    actor_id_map    = {}
    film_id_map     = {}

    ActiveRecord::Base.transaction do
      # ── Lookup tables ───────────────────────────────────────────────────────

      puts "\n[1/9] Disk formats (#{formats_data.size})"
      formats_data.each do |r|
        df = DiskFormat.find_or_create_by!(name: r["format"].strip)
        format_id_map[r["for_id"].to_i] = df.id
      end

      puts "[2/9] Categories (#{categories_data.size})"
      categories_data.each do |r|
        cat = Category.find_or_create_by!(name: r["cat"].strip)
        category_id_map[r["cat_id"].to_i] = cat.id
      end

      puts "[3/9] Genres (#{genres_data.size})"
      genres_data.each do |r|
        genre = Genre.find_or_create_by!(name: r["gen_name"].strip)
        genre_id_map[r["gen_id"].to_i] = genre.id
      end

      puts "[4/9] Qualities (#{qualities_data.size})"
      qualities_data.each do |r|
        quality = Quality.find_or_create_by!(name: r["q_name"].strip)
        quality_id_map[r["q_id"].to_i] = quality.id
      end

      puts "[5/9] Reviewers (#{reviewers_data.size})"
      reviewers_data.each do |r|
        reviewer = Reviewer.find_or_create_by!(name: r["rev_name"].strip)
        reviewer_id_map[r["rev_id"].to_i] = reviewer.id
      end

      # ── People ─────────────────────────────────────────────────────────────

      puts "[6/9] Directors (#{directors_data.size})"
      directors_data.each do |r|
        first = LegacyImporter.titleize(r["dir_f_name"]) || ""
        last  = LegacyImporter.titleize(r["dir_l_name"]) || ""
        dir   = Director.find_or_create_by!(first_name: first, last_name: last)
        director_id_map[r["dir_id"].to_i] = dir.id
      end

      puts "[7/9] Actors (#{actors_data.size})"
      actors_data.each do |r|
        first = LegacyImporter.titleize(r["act_f_name"]) || ""
        last  = LegacyImporter.titleize(r["act_l_name"]) # nil is fine for single-name people
        actor = Actor.find_or_create_by!(first_name: first, last_name: last) do |a|
          a.gender = r["act_gender"]&.strip.presence
        end
        actor_id_map[r["act_id"].to_i] = actor.id
      end

      # ── Disks ──────────────────────────────────────────────────────────────

      puts "[8/9] Disks (#{disks_data.size})"
      disks_data.each do |r|
        fmt_new_id = format_id_map[r["for_id"].to_i]
        disk = Disk.find_or_create_by!(name: r["d_name"].strip) do |d|
          d.storage_type   = "HDD"
          d.disk_format_id = fmt_new_id
        end
        disk_id_map[r["d_id"].to_i] = disk.id
      end

      # ── Fallback disk for films with no disk assignment in legacy data ─────
      fallback_disk = Disk.find_or_create_by!(name: "Legacy Import") do |d|
        d.storage_type   = "HDD"
        d.disk_format_id = DiskFormat.first&.id
      end

      # ── Movies ─────────────────────────────────────────────────────────────

      puts "[9/9] Movies (#{films_data.size})"
      imported = 0
      skipped  = 0
      errors   = 0

      films_data.each do |r|
        name     = LegacyImporter.titleize(r["fil_name"])
        version  = r["version"]&.strip.presence
        cat_id   = category_id_map[r["cat_id"].to_i]
        disk_id  = disk_id_map[r["d_id"].to_i] || fallback_disk.id
        genre_id = genre_id_map[r["gen_id"].to_i]
        qual_id  = quality_id_map[r["q_id"].to_i]
        year_val = years_map[r["y_id"].to_i]
        dir_id   = director_id_map[direction_map[r["fil_id"].to_i]]

        raw_size = r["fil_size"].to_f
        file_size_val = raw_size.positive? ? raw_size.to_s : nil

        movie = Movie.find_or_initialize_by(name: name, version: version)

        if movie.persisted?
          film_id_map[r["fil_id"].to_i] = movie.id
          skipped += 1
          next
        end

        movie.assign_attributes(
          description: r["fil_depn"]&.strip.presence,
          file_size:   file_size_val,
          runtime:     LegacyImporter.to_minutes(r["fil_length"]),
          category_id: cat_id,
          disk_id:     disk_id,
          director_id: dir_id,
          year:        year_val
        )

        unless movie.save
          puts "  ERROR #{name.inspect} v#{version.inspect}: #{movie.errors.full_messages.join(', ')}"
          errors += 1
          next
        end

        movie.genres   << Genre.find_by(id: genre_id)    if genre_id
        movie.qualities << Quality.find_by(id: qual_id)  if qual_id

        film_id_map[r["fil_id"].to_i] = movie.id
        imported += 1
      end

      puts "  → #{imported} imported, #{skipped} skipped (already exist), #{errors} errors"

      # ── Cast associations ───────────────────────────────────────────────────

      puts "\nLinking cast (#{cast_data.size} entries)..."
      cast_added = 0
      cast_data.each do |r|
        movie = Movie.find_by(id: film_id_map[r["fil_id"].to_i])
        actor = Actor.find_by(id: actor_id_map[r["act_id"].to_i])
        next unless movie && actor
        next if movie.actors.include?(actor)

        movie.actors << actor
        cast_added += 1
      end
      puts "  → #{cast_added} cast links added"

      # ── Ratings ────────────────────────────────────────────────────────────

      puts "Importing ratings (#{rating_data.size})..."
      ratings_added = 0
      rating_data.each do |r|
        movie_id    = film_id_map[r["fil_id"].to_i]
        reviewer_id = reviewer_id_map[r["rev_id"].to_i]
        next unless movie_id && reviewer_id

        Rating.find_or_create_by!(movie_id: movie_id, reviewer_id: reviewer_id) do |rating|
          rating.rating_value  = r["num_o_ratings"].to_f
          rating.rating_out_of = r["rating_out_of"].to_i
        end
        ratings_added += 1
      end
      puts "  → #{ratings_added} ratings added"
    end

    puts "\n✓ Import complete."
  end
end
