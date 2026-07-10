const crypto = require("crypto");
const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");
const { getPool } = require("../db");

const PgSession = connectPgSimple(session);

function createSessionMiddleware() {
  const pool = getPool();
  if (!pool) {
    console.warn("DATABASE_URL mangler – sessioner er deaktiveret.");
    return (_req, _res, next) => next();
  }

  if (!process.env.SESSION_SECRET) {
    console.warn("SESSION_SECRET mangler – sessioner er deaktiveret.");
    return (_req, _res, next) => next();
  }

  const isProduction = process.env.NODE_ENV === "production";

  return session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: false,
      // GDPR: udløbne sessioner slettes fra databasen hver time,
      // så gamle sessionsdata ikke bliver liggende.
      pruneSessionInterval: 60 * 60,
    }),
    name: "plannio.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
    },
  });
}

function createOAuthState() {
  return crypto.randomBytes(24).toString("hex");
}

module.exports = {
  createSessionMiddleware,
  createOAuthState,
};
