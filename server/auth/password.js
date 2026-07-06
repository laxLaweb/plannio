const crypto = require("crypto");

const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, "hex");
  const suppliedBuffer = crypto.scryptSync(password, salt, KEY_LENGTH);
  if (hashBuffer.length !== suppliedBuffer.length) return false;

  return crypto.timingSafeEqual(hashBuffer, suppliedBuffer);
}

module.exports = { hashPassword, verifyPassword };
