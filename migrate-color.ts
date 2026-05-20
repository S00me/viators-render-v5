import Database from 'better-sqlite3';
const db = new Database('./database.db');

console.log("Migrating gear categories table for color support...");

try {
  db.exec("ALTER TABLE gear_categories ADD COLUMN color TEXT");
  console.log("Added color column successfully");
} catch(e: any) {
  console.log("color column already exists or error: ", e.message);
}

console.log("Migration complete!");
