import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-[100dvh] flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="text-center">
        <h1
          className="text-6xl sm:text-8xl font-black italic mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "var(--burgundy)",
            opacity: 0.15,
          }}
        >
          404
        </h1>
        <h2
          className="text-2xl sm:text-3xl font-bold mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "var(--burgundy)",
          }}
        >
          Page Not Found
        </h2>
        <p
          className="text-sm mb-8 max-w-sm mx-auto"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--warm-grey)",
            opacity: 0.7,
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--burgundy)",
            color: "var(--cream)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
