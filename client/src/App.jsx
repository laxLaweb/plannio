import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CreatePollProvider } from "./context/CreatePollContext";
import { LandingPage } from "./components/landing/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { CreatePollPage } from "./pages/CreatePollPage";
import { PollDetailPage } from "./pages/PollDetailPage";
import { PollVotePage } from "./pages/PollVotePage";
import { MyPollsPage } from "./pages/MyPollsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CreatePollProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/polls" element={<MyPollsPage />} />
            <Route path="/polls/new" element={<CreatePollPage />} />
            <Route path="/polls/:id" element={<PollDetailPage />} />
            <Route path="/p/:slug" element={<PollVotePage />} />
          </Routes>
        </CreatePollProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
