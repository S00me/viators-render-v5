import Database from 'better-sqlite3';
const db = new Database('./database.db');

console.log("Migrating gear database...");

try {
  db.exec("ALTER TABLE gear_items ADD COLUMN parent_item_id INTEGER");
  console.log("Added parent_item_id column");
} catch(e: any) {
  console.log("parent_item_id column already exists or error: ", e.message);
}

try {
  db.exec("ALTER TABLE gear_items ADD COLUMN is_note BOOLEAN DEFAULT 0");
  console.log("Added is_note column");
} catch(e: any) {
  console.log("is_note column already exists or error: ", e.message);
}

console.log("Migration complete!");
