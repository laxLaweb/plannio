import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CreatePollProvider } from "./context/CreatePollContext";
import { LandingPage } from "./components/landing/LandingPage";
import { Analytics, GoogleAnalyticsPageView } from "./components/Analytics";

const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const CreatePollPage = lazy(() =>
  import("./pages/CreatePollPage").then((m) => ({ default: m.CreatePollPage })),
);
const PollDetailPage = lazy(() =>
  import("./pages/PollDetailPage").then((m) => ({ default: m.PollDetailPage })),
);
const PollVotePage = lazy(() =>
  import("./pages/PollVotePage").then((m) => ({ default: m.PollVotePage })),
);
const MyPollsPage = lazy(() =>
  import("./pages/MyPollsPage").then((m) => ({ default: m.MyPollsPage })),
);
const AccountPage = lazy(() =>
  import("./pages/AccountPage").then((m) => ({ default: m.AccountPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/legal/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() =>
  import("./pages/legal/TermsPage").then((m) => ({ default: m.TermsPage })),
);

const DiscordSchedulingPage = lazy(() =>
  import("./pages/content/DiscordSchedulingPage").then((m) => ({
    default: m.DiscordSchedulingPage,
  })),
);
const SlackSchedulingPage = lazy(() =>
  import("./pages/content/SlackSchedulingPage").then((m) => ({
    default: m.SlackSchedulingPage,
  })),
);
const WeekendTripPage = lazy(() =>
  import("./pages/content/use-cases/WeekendTripPage").then((m) => ({
    default: m.WeekendTripPage,
  })),
);
const TeamMeetingsPage = lazy(() =>
  import("./pages/content/use-cases/TeamMeetingsPage").then((m) => ({
    default: m.TeamMeetingsPage,
  })),
);
const GameNightPage = lazy(() =>
  import("./pages/content/use-cases/GameNightPage").then((m) => ({
    default: m.GameNightPage,
  })),
);
const DiscordPollWithoutBotPage = lazy(() =>
  import("./pages/content/guides/DiscordPollWithoutBotPage").then((m) => ({
    default: m.DiscordPollWithoutBotPage,
  })),
);
const StopChasingRepliesPage = lazy(() =>
  import("./pages/content/guides/StopChasingRepliesPage").then((m) => ({
    default: m.StopChasingRepliesPage,
  })),
);
const DateRangesPage = lazy(() =>
  import("./pages/content/guides/DateRangesPage").then((m) => ({
    default: m.DateRangesPage,
  })),
);

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <GoogleAnalyticsPageView />
      <AuthProvider>
        <CreatePollProvider>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/discord-scheduling" element={<DiscordSchedulingPage />} />
              <Route path="/slack-scheduling" element={<SlackSchedulingPage />} />
              <Route path="/use-cases/weekend-trip" element={<WeekendTripPage />} />
              <Route path="/use-cases/team-meetings" element={<TeamMeetingsPage />} />
              <Route path="/use-cases/game-night" element={<GameNightPage />} />
              <Route path="/guides/discord-poll-without-bot" element={<DiscordPollWithoutBotPage />} />
              <Route path="/guides/stop-chasing-replies" element={<StopChasingRepliesPage />} />
              <Route path="/guides/date-ranges" element={<DateRangesPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/polls" element={<MyPollsPage />} />
              <Route path="/polls/new" element={<CreatePollPage />} />
              <Route path="/polls/:id" element={<PollDetailPage />} />
              <Route path="/p/:slug" element={<PollVotePage />} />
            </Routes>
          </Suspense>
        </CreatePollProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
