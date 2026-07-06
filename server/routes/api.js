const { Router } = require("express");
const { checkConnection } = require("../db");

const router = Router();

router.get("/health", async (_req, res) => {
  const db = await checkConnection();

  const payload = {
    status: "ok",
    message: "Plannio API kører",
    database: db.configured
      ? db.connected
        ? "connected"
        : "error"
      : "not_configured",
  };

  if (db.error) {
    payload.databaseError = db.error;
  }

  if (db.configured && !db.connected) {
    payload.status = "degraded";
  }

  res.status(payload.status === "ok" ? 200 : 503).json(payload);
});

module.exports = router;
