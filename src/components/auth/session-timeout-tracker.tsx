import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateLastActivity, isSessionInactive, removeToken, isAuthenticated } from "@/lib/auth-utils";

/**
 * Hook to automatically track user activity and log out if idle for 3 hours.
 */
export function useSessionTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Only track if user is authenticated
    if (!isAuthenticated()) return;

    // 1. Update activity on user interaction
    const handleUserActivity = () => {
      updateLastActivity(false);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // 2. Check inactivity when user switches back to this browser tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (isSessionInactive()) {
          removeToken();
          navigate("/login?reason=inactivity", { replace: true });
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. Periodic check every 30 seconds
    const interval = setInterval(() => {
      if (isSessionInactive()) {
        removeToken();
        navigate("/login?reason=inactivity", { replace: true });
      }
    }, 30000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [navigate]);
}
