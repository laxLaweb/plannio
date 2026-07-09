import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { POST_LOGIN_REDIRECT_KEY } from "@/components/auth/constants";

// Lazy: keeps Radix Dialog out of the main bundle — only anonymous visitors
// who click "Create poll" ever need the modal.
const LoginModal = lazy(() =>
  import("@/components/auth/LoginModal").then((m) => ({ default: m.LoginModal })),
);

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
      {loginModalOpen && (
        <Suspense fallback={null}>
          <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
        </Suspense>
      )}
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
