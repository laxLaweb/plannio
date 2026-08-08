function parseLocalDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

/** ISO 8601 week number (Mon–Sun), matching European week numbers. */
function getISOWeekNumber(date) {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(((utc - yearStart) / 86400000 + 1) / 7);
}

function weekNumbersInRange(startStr, endStr) {
  if (!startStr) return [];

  const start = parseLocalDate(startStr);
  const end = parseLocalDate(endStr && endStr !== startStr ? endStr : startStr);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const weeks = [];
  const seen = new Set();
  const cursor = new Date(start);

  while (cursor <= end) {
    const week = getISOWeekNumber(cursor);
    if (!seen.has(week)) {
      seen.add(week);
      weeks.push(week);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return weeks;
}

function formatWeekNumbersLabel(startStr, endStr) {
  const weeks = weekNumbersInRange(startStr, endStr);
  if (weeks.length === 0) return null;
  return weeks.map((week) => `Week ${week}`).join(" · ");
}

module.exports = {
  getISOWeekNumber,
  weekNumbersInRange,
  formatWeekNumbersLabel,
};
