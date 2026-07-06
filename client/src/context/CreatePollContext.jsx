import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { POST_LOGIN_REDIRECT_KEY } from "@/components/auth/LoginOptions";

const CREATE_POLL_PATH = "/polls/new";

const CreatePollContext = createContext(null);

export function CreatePollProvider({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    setLoginModalOpen(false);

    const redirect = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    if (redirect) {
      sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
      navigate(redirect);
    }
  }, [user, loading, navigate]);

  const requestCreatePoll = useCallback(() => {
    if (loading) {
      return;
    }

    if (user) {
      navigate(CREATE_POLL_PATH);
      return;
    }

    setLoginModalOpen(true);
  }, [user, loading, navigate]);

  const value = useMemo(
    () => ({ requestCreatePoll, createPollPath: CREATE_POLL_PATH }),
    [requestCreatePoll],
  );

  return (
    <CreatePollContext.Provider value={value}>
      {children}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </CreatePollContext.Provider>
  );
}

export function useCreatePoll() {
  const context = useContext(CreatePollContext);
  if (!context) {
    throw new Error("useCreatePoll must be used within CreatePollProvider");
  }
  return context;
}
