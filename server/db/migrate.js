const fs = require("fs");
const path = require("path");
require("dotenv").config({ override: true });

const { getPool, closePool } = require("./index");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function getAppliedVersions(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const result = await client.query(
    "SELECT version FROM schema_migrations ORDER BY version",
  );
  return new Set(result.rows.map((row) => row.version));
}

async function runMigrations() {
  const pool = getPool();
  if (!pool) {
    console.error("DATABASE_URL er ikke sat – migration afbrudt.");
    process.exit(1);
  }

  const client = await pool.connect();

  try {
    const applied = await getAppliedVersions(client);
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("Ingen migrationer fundet.");
      return;
    }

    for (const file of files) {
      const version = file.replace(/\.sql$/, "");
      if (applied.has(version)) {
        console.log(`Skip: ${version} (allerede kørt)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (version) VALUES ($1)",
          [version],
        );
        await client.query("COMMIT");
        console.log(`Kørt: ${version}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Migrationer fuldført.");
  } finally {
    client.release();
    await closePool();
  }
}

runMigrations().catch((error) => {
  console.error("Migration fejlede:", error.message);
  process.exit(1);
});
