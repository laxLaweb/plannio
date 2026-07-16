import { useEffect, useRef, useState } from "react";
import { Plug, Plus, RefreshCw, Trash2 } from "lucide-react";
import { DiscordIcon, SlackIcon } from "@/components/auth/LoginOptions";
import { useAuth } from "@/context/AuthContext";

const EVENT_OPTIONS = [
  { id: "created", label: "When the poll is created" },
  { id: "vote", label: "When someone votes" },
  { id: "locked", label: "When a time is locked in" },
  { id: "reminder", label: "Reminders for people who haven't voted" },
];

const ALL_EVENTS = EVENT_OPTIONS.map((e) => e.id);

const DAY_MS = 24 * 60 * 60 * 1000;
const REMINDER_WEEKS = 6;

function pad(n) {
  return String(n).padStart(2, "0");
}

function toLocalInputValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// One reminder per week that goes by without everyone responding, capped at
// the earliest proposed date (no point nagging people after the event).
function computeDefaultReminders(earliestDate) {
  const now = Date.now();
  const cutoff = earliestDate ? new Date(`${earliestDate}T00:00:00`).getTime() : null;
  const results = [];

  for (let week = 1; week <= REMINDER_WEEKS; week += 1) {
    const date = new Date(now + week * 7 * DAY_MS);
    date.setHours(9, 0, 0, 0);
    if (cutoff && date.getTime() >= cutoff) break;
    results.push(date);
  }

  if (results.length === 0) {
    const fallback = new Date(now + DAY_MS);
    fallback.setHours(9, 0, 0, 0);
    results.push(fallback);
  }

  return results.map(toLocalInputValue);
}

const PROVIDERS = {
  discord: {
    name: "Discord",
    icon: DiscordIcon,
    color: "#5865F2",
    hoverColor: "#4752C4",
    connectLabel: "Connect Discord channel",
  },
  slack: {
    name: "Slack",
    icon: SlackIcon,
    color: "#4A154B",
    hoverColor: "#3a1039",
    connectLabel: "Connect Slack channel",
  },
};

function useProviderConnection(provider) {
  const [available, setAvailable] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const messageType = `${provider}-webhook`;

  useEffect(() => {
    fetch(`/api/integrations/${provider}/status`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAvailable(Boolean(data.configured));
        if (data.connected) setConnected(true);
      })
      .catch(() => setAvailable(false));
  }, [provider]);

  useEffect(() => {
    function handleMessage(event) {
      const data = event.data;
      if (!data || data.type !== messageType) return;

      if (data.ok) {
        setConnected(true);
        setError(null);
      } else {
        setError("Connection was not completed. Try again.");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [messageType]);

  const openPopup = () => {
    setError(null);
    const width = 520;
    const height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    popupRef.current = window.open(
      `/api/integrations/${provider}/connect`,
      `plannio-${provider}`,
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  };

  const disconnect = async () => {
    await fetch(`/api/integrations/${provider}/disconnect`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setConnected(false);
  };

  return { available, connected, error, openPopup, disconnect };
}

function ProviderRow({ provider, connection }) {
  const meta = PROVIDERS[provider];
  const Icon = meta.icon;

  if (connection.available === false) {
    return null;
  }

  return (
    <div>
      {!connection.connected ? (
        <button
          type="button"
          onClick={connection.openPopup}
          disabled={connection.available === null}
          style={{ backgroundColor: meta.color }}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Icon />
          {meta.connectLabel}
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-sm font-medium text-success">
          <Icon />
          {meta.name} connected
          <button
            type="button"
            onClick={connection.openPopup}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Change channel
          </button>
          <button
            type="button"
            onClick={connection.disconnect}
            className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            Remove
          </button>
        </div>
      )}
      {connection.error && <p className="mt-2 text-xs text-destructive">{connection.error}</p>}
    </div>
  );
}

export function ChannelUpdates({ onChange, earliestDate }) {
  const { user } = useAuth();
  const loginProvider = user?.loginProvider;
  const showDiscord = loginProvider !== "slack";
  const showSlack = loginProvider !== "discord";

  const discordConn = useProviderConnection("discord");
  const slackConn = useProviderConnection("slack");

  const [events, setEvents] = useState(ALL_EVENTS);
  const [expected, setExpected] = useState("");
  const [reminders, setReminders] = useState(() => computeDefaultReminders(earliestDate));
  const remindersTouchedRef = useRef(false);

  useEffect(() => {
    const parsed = Number.parseInt(expected, 10);
    const reminderIso = events.includes("reminder")
      ? reminders.filter(Boolean).map((value) => new Date(value).toISOString())
      : [];

    onChange({
      discord: { enabled: showDiscord && discordConn.connected, events },
      slack: { enabled: showSlack && slackConn.connected, events },
      expectedResponses: Number.isFinite(parsed) && parsed > 0 ? parsed : null,
      reminders: reminderIso,
    });
  }, [showDiscord, showSlack, discordConn.connected, slackConn.connected, events, expected, reminders, onChange]);

  const toggleEvent = (id) => {
    setEvents((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const updateReminder = (index, value) => {
    remindersTouchedRef.current = true;
    setReminders((prev) => prev.map((r, i) => (i === index ? value : r)));
  };

  const removeReminder = (index) => {
    remindersTouchedRef.current = true;
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  const addReminder = () => {
    remindersTouchedRef.current = true;
    setReminders((prev) => {
      const last = prev[prev.length - 1];
      const base = last ? new Date(last) : new Date();
      const next = new Date(base.getTime() + DAY_MS);
      return [...prev, toLocalInputValue(next)];
    });
  };

  const discordVisible = showDiscord && discordConn.available !== false;
  const slackVisible = showSlack && slackConn.available !== false;

  if (!discordVisible && !slackVisible) {
    return null;
  }

  const anyConnected =
    (showDiscord && discordConn.connected) || (showSlack && slackConn.connected);

  const channelDescription =
    showDiscord && showSlack
      ? "Send updates directly to a Discord and/or Slack channel. Pick the channel during connect — no bot invite needed."
      : showDiscord
        ? "Send updates directly to a Discord channel. Pick the channel during connect — no bot invite needed."
        : "Send updates directly to a Slack channel. Pick the channel during connect — no app install needed.";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <Plug className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Channel updates</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{channelDescription}</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-semibold text-foreground">Expected responses</label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Track when everyone has responded (optional).
        </p>
        <input
          type="number"
          min="1"
          value={expected}
          onChange={(e) => setExpected(e.target.value)}
          placeholder="e.g. 8"
          className="mt-2 w-32 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {showDiscord && <ProviderRow provider="discord" connection={discordConn} />}
        {showSlack && <ProviderRow provider="slack" connection={slackConn} />}
      </div>

      <div className="mt-4">
        {!anyConnected && (
          <p className="mb-2 text-xs text-muted-foreground">
            Connect a channel above to activate these — you can still set them up now.
          </p>
        )}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Send a message when:</p>
          {EVENT_OPTIONS.map((opt) => (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={events.includes(opt.id)}
                onChange={() => toggleEvent(opt.id)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>

        {events.includes("reminder") && (
          <div className="mt-3 rounded-2xl border border-border bg-background p-3.5">
            <p className="text-xs font-semibold text-foreground">Remind on these dates</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              We'll only send a reminder if not everyone expected has responded yet.
            </p>
            <div className="mt-3 space-y-2">
              {reminders.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={value}
                    onChange={(e) => updateReminder(index, e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeReminder(index)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                    aria-label="Remove reminder"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addReminder}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="h-3.5 w-3.5" /> Add reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
