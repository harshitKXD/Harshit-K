import { Link } from "react-router";
import { LogIn } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <main
      className="min-h-[100dvh] flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="w-full max-w-sm text-center">
        <h1
          className="text-3xl font-bold italic mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "var(--burgundy)",
          }}
        >
          Welcome Back
        </h1>
        <p
          className="text-sm mb-8"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--warm-grey)",
            opacity: 0.7,
          }}
        >
          Sign in to access your admin dashboard
        </p>
        <button
          onClick={() => {
            window.location.href = getOAuthUrl();
          }}
          className="w-full py-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--burgundy)",
            color: "var(--cream)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <LogIn size={16} />
          Sign in with Kimi
        </button>
        <Link
          to="/"
          className="inline-block mt-6 text-xs uppercase tracking-wider transition-opacity hover:opacity-60"
          style={{ color: "var(--burgundy)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
