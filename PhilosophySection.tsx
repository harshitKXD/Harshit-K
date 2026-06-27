import { Link } from "react-router";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function FooterSection() {
  return (
    <footer
      style={{ backgroundColor: "var(--mahogany)" }}
      className="relative"
    >
      {/* Newsletter CTA */}
      <div className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold italic text-center lg:text-left"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--cream)",
            }}
          >
            Start the Adventure.
          </h2>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 text-sm bg-transparent border border-white/20 text-[var(--cream)] placeholder:text-white/40 focus:outline-none focus:border-[var(--mustard)] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              className="px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.02] flex-shrink-0"
              style={{
                backgroundColor: "var(--mustard)",
                color: "var(--burgundy)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3
              className="text-2xl font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "var(--cream)",
              }}
            >
              WonderWorks
            </h3>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--cream)",
                opacity: 0.6,
              }}
            >
              Handcrafted heirloom toys designed to spark endless curiosity and wonder.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:bg-white/10"
                >
                  <Icon size={15} color="var(--cream)" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-medium mb-5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--mustard)",
              }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {["All Toys", "Wooden Toys", "Plush & Soft", "Puzzles", "Musical"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to="/shop"
                      className="text-sm transition-opacity duration-300 hover:opacity-70"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "var(--cream)",
                        opacity: 0.6,
                      }}
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-medium mb-5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--mustard)",
              }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {["About Us", "Our Story", "Sustainability", "Careers"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-opacity duration-300 hover:opacity-70"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "var(--cream)",
                        opacity: 0.6,
                      }}
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-medium mb-5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--mustard)",
              }}
            >
              Support
            </h4>
            <ul className="space-y-3">
              {["Contact Us", "Shipping", "Returns", "FAQ"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm transition-opacity duration-300 hover:opacity-70"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "var(--cream)",
                      opacity: 0.6,
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--cream)",
              opacity: 0.4,
            }}
          >
            &copy; {new Date().getFullYear()} WonderWorks. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Mail size={12} color="var(--cream)" opacity={0.4} />
            <span
              className="text-xs"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--cream)",
                opacity: 0.4,
              }}
            >
              hello@wonderworks.toys
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
