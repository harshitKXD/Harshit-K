import { useEffect } from "react";

const SESSION_KEY = "sessionId";

function generateSessionId(): string {
  return "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function useSession() {
  useEffect(() => {
    getSessionId();
  }, []);
}
