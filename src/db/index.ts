import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('database.db');
const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS upcoming_expedition (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      title TEXT,
      description TEXT,
      elevation TEXT,
      distance TEXT,
      duration TEXT,
      shelter TEXT,
      region TEXT,
      highlights TEXT,
      route_gpx TEXT,
      center_lat REAL,
      center_lng REAL,
      zoom INTEGER,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS past_trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      date TEXT,
      location TEXT,
      elevation TEXT,
      image TEXT,
      description TEXT,
      route_gpx TEXT,
      center_lat REAL,
      center_lng REAL,
      zoom INTEGER
    );

    CREATE TABLE IF NOT EXISTS past_trip_gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER,
      image_url TEXT,
      FOREIGN KEY(trip_id) REFERENCES past_trips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS itinerary_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_number INTEGER,
      title TEXT,
      description TEXT,
      km TEXT,
      elevation_gain TEXT,
      elevation_loss TEXT,
      shelter TEXT,
      water_source BOOLEAN,
      food_source BOOLEAN,
      store_source BOOLEAN,
      difficulty TEXT,
      komoot_link TEXT,
      gpx_url TEXT,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS gear_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS gear_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT,
      FOREIGN KEY(category_id) REFERENCES gear_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS itinerary_map_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS itinerary_map_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER,
      file_url TEXT,
      FOREIGN KEY(group_id) REFERENCES itinerary_map_groups(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS about_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      description TEXT,
      description_hu TEXT,
      vision TEXT,
      vision_hu TEXT,
      community TEXT,
      community_hu TEXT,
      how_to_join TEXT,
      how_to_join_hu TEXT,
      logo_url TEXT,
      group_photo_url TEXT
    );
  `);

  try {
    db.exec("ALTER TABLE upcoming_expedition ADD COLUMN image TEXT");
  } catch (e) {
    // Column likely already exists
  }

  const upcomingHuCols = ['title_hu', 'description_hu', 'region_hu', 'shelter_hu', 'highlights_hu', 'elevation_hu', 'distance_hu', 'duration_hu'];
  for (const col of upcomingHuCols) {
    try { db.exec(`ALTER TABLE upcoming_expedition ADD COLUMN ${col} TEXT`); } catch (e) {}
  }

  const pastTripsHuCols = ['name_hu', 'location_hu', 'description_hu', 'elevation_hu', 'date_hu'];
  for (const col of pastTripsHuCols) {
    try { db.exec(`ALTER TABLE past_trips ADD COLUMN ${col} TEXT`); } catch (e) {}
  }

  const itineraryHuCols = ['title_hu', 'description_hu', 'shelter_hu', 'km_hu', 'elevation_gain_hu', 'elevation_loss_hu', 'difficulty_hu'];
  for (const col of itineraryHuCols) {
    try { db.exec(`ALTER TABLE itinerary_days ADD COLUMN ${col} TEXT`); } catch (e) {}
  }

  try { db.exec(`ALTER TABLE gear_categories ADD COLUMN name_hu TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE gear_items ADD COLUMN name_hu TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE itinerary_map_groups ADD COLUMN name_hu TEXT`); } catch (e) {}

  try {
    db.exec("ALTER TABLE itinerary_days ADD COLUMN store_source BOOLEAN");
  } catch (e) {
    // Column likely already exists
  }

  db.exec(`
    INSERT OR IGNORE INTO upcoming_expedition (id, title, description, elevation, distance, duration, shelter, region, highlights, route_gpx, center_lat, center_lng, zoom, image)
    VALUES (
      1,
      'Upcoming Expedition Title',
      'A detailed description of the upcoming expedition. This is a placeholder text that you can change in the admin panel.',
      '4,000m',
      '20km',
      '3 Days',
      'Mountain Hut',
      'Alpine Region',
      '["Glacier Crossing", "Ridge Scramble", "Technical Rock", "Exposed"]',
      NULL,
      46.0000,
      7.7300,
      13,
      NULL
    );
  `);

  db.exec(`
    INSERT OR IGNORE INTO about_content (id, description, vision, community, how_to_join)
    VALUES (
      1,
      'Welcome to Viators. We are a community of passionate alpinists.',
      'Our vision is to explore the highest peaks and share the journey.',
      'Join our community of like-minded adventurers.',
      'Message us on Instagram to join our next expedition.'
    );
  `);

  // Check if past_trips is empty, if so, seed it
  const count = db.prepare('SELECT count(*) as count FROM past_trips').get() as { count: number };
  if (count.count === 0) {
    const insertTrip = db.prepare(`
      INSERT INTO past_trips (name, date, location, elevation, image, description, route_gpx, center_lat, center_lng, zoom)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const trips = [
      {
        name: 'Past Expedition 1',
        date: 'Aug 2025',
        location: 'Mountain Range',
        elevation: '4,000m',
        image: '',
        description: 'A multi-day traverse across a beautiful massif. Challenging glacier travel and high altitude camps.',
        route_gpx: null,
        center_lat: 45.9369,
        center_lng: 7.8668,
        zoom: 12
      },
      {
        name: 'Past Expedition 2',
        date: 'Jul 2025',
        location: 'Alpine Valley',
        elevation: '3,500m',
        image: '',
        description: 'A classic snow climb with a rocky summit block.',
        route_gpx: null,
        center_lat: 45.5203,
        center_lng: 7.2656,
        zoom: 12
      }
    ];

    trips.forEach(trip => {
      insertTrip.run(
        trip.name, trip.date, trip.location, trip.elevation, trip.image, trip.description,
        trip.route_gpx, trip.center_lat, trip.center_lng, trip.zoom
      );
    });
  }
}

export default db;
