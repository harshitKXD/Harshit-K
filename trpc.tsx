import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import SpatialCarousel from "@/components/SpatialCarousel";
import gsap from "gsap";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
      .fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center">
      {/* 3D Carousel Background */}
      <div className="absolute inset-0 z-0">
        <SpatialCarousel />
      </div>

      {/* Gradient Overlay for readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(247,241,227,0.85) 0%, rgba(247,241,227,0.4) 60%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic leading-[1.1] mb-6 opacity-0"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "var(--burgundy)",
          }}
        >
          Play is the highest
          <br />
          form of research.
        </h1>
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl mb-10 opacity-0 max-w-xl mx-auto"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--warm-grey)",
          }}
        >
          Heirloom toys designed to spark endless curiosity.
        </p>
        <button
          ref={ctaRef}
          onClick={() => navigate("/shop")}
          className="px-10 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-500 opacity-0 hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--burgundy)",
            color: "var(--cream)",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--mustard)";
            e.currentTarget.style.color = "var(--burgundy)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--burgundy)";
            e.currentTarget.style.color = "var(--cream)";
          }}
        >
          Explore Collection
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[2] pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--cream), transparent)",
        }}
      />
    </section>
  );
}
