const { Pool } = require("pg");

let pool = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL || null;
}

function requiresSsl(connectionString) {
  if (process.env.PGSSLMODE === "disable") {
    return false;
  }
  if (process.env.PGSSLMODE === "require") {
    return true;
  }
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  try {
    const { hostname } = new URL(connectionString);
    return hostname !== "localhost" && hostname !== "127.0.0.1";
  } catch {
    return false;
  }
}

function createPool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    return null;
  }

  const ssl = requiresSsl(connectionString) ? { rejectUnauthorized: false } : false;

  return new Pool({ connectionString, ssl });
}

function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

async function query(text, params) {
  const db = getPool();
  if (!db) {
    throw new Error("DATABASE_URL er ikke sat");
  }
  return db.query(text, params);
}

async function checkConnection() {
  const db = getPool();
  if (!db) {
    return { configured: false, connected: false };
  }

  try {
    await db.query("SELECT 1");
    return { configured: true, connected: true };
  } catch (error) {
    return { configured: true, connected: false, error: error.message };
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  getPool,
  query,
  checkConnection,
  closePool,
};
