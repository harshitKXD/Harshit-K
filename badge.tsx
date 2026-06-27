import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggle, itemCount } = useCartStore();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const bgClass = scrolled
    ? "bg-[#F7F1E3]/95 backdrop-blur-md shadow-sm"
    : isHome
      ? "bg-transparent"
      : "bg-[#F7F1E3]/95 backdrop-blur-md";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{ color: "var(--burgundy)" }}
              >
                WonderWorks
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Shop", path: "/shop" },
                { label: "Collections", path: "/shop" },
                { label: "About", path: "/#about" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 hover:opacity-70"
                  style={{ color: "var(--burgundy)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                className="p-2 transition-opacity hover:opacity-60 hidden sm:block"
                style={{ color: "var(--burgundy)" }}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="p-2 transition-opacity hover:opacity-60 hidden sm:block"
                  style={{ color: "var(--burgundy)" }}
                  title="Admin"
                >
                  <User size={18} strokeWidth={1.5} />
                </Link>
              )}

              {user ? (
                <button
                  onClick={logout}
                  className="p-2 transition-opacity hover:opacity-60 text-xs uppercase tracking-wider hidden sm:block"
                  style={{ color: "var(--burgundy)" }}
                >
                  <User size={18} strokeWidth={1.5} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 transition-opacity hover:opacity-60 hidden sm:block"
                  style={{ color: "var(--burgundy)" }}
                >
                  <User size={18} strokeWidth={1.5} />
                </Link>
              )}

              <button
                onClick={toggle}
                className="p-2 relative transition-opacity hover:opacity-60"
                style={{ color: "var(--burgundy)" }}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: "var(--mustard)", color: "var(--burgundy)" }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                className="p-2 md:hidden transition-opacity hover:opacity-60"
                style={{ color: "var(--burgundy)" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 pt-20 px-6 py-8 md:hidden"
          style={{ backgroundColor: "var(--cream)" }}
        >
          <div className="flex flex-col gap-6">
            {[
              { label: "Shop", path: "/shop" },
              { label: "Collections", path: "/shop" },
              { label: "About", path: "/#about" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-2xl font-medium"
                style={{
                  color: "var(--burgundy)",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-2xl font-medium"
                style={{
                  color: "var(--burgundy)",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
