// Provider-agnostic helpers shared by discord.js and slack.js.

function getAppUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

function shareUrlFor(poll) {
  return `${getAppUrl()}/p/${poll.slug}`;
}

function formatOptionLabel(option) {
  const start = new Date(`${option.option_date}T00:00:00`);
  const dateLabel = start.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  let label = dateLabel;
  if (option.end_date && option.end_date !== option.option_date) {
    const end = new Date(`${option.end_date}T00:00:00`);
    label += ` – ${end.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })}`;
  }

  let time = "All day";
  if (!option.all_day && option.start_time) {
    const from = String(option.start_time).slice(0, 5);
    time = option.end_time ? `${from} – ${String(option.end_time).slice(0, 5)}` : from;
  }

  return `${label} — ${time}`;
}

function formatOptionLine(option) {
  return `• ${formatOptionLabel(option)}`;
}

module.exports = { getAppUrl, shareUrlFor, formatOptionLabel, formatOptionLine };
