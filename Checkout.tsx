import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Heart, TreePine, Gem } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every toy is handcrafted by skilled artisans who pour their heart into each piece.",
  },
  {
    icon: TreePine,
    title: "Sustainable Materials",
    description:
      "We use only FSC-certified woods, organic paints, and eco-friendly packaging.",
  },
  {
    icon: Sparkles,
    title: "Sparks Imagination",
    description:
      "Open-ended play that encourages creativity, problem-solving, and storytelling.",
  },
  {
    icon: Gem,
    title: "Heirloom Quality",
    description:
      "Built to last generations, these toys become cherished family treasures.",
  },
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards stagger
      const cards = cardsRef.current?.querySelectorAll(".value-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "var(--cream)" }}
    >
      {/* Decorative SVG path */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.04]"
        viewBox="0 0 227 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q40,20 80,50 T160,50 T227,50"
          fill="none"
          stroke="var(--burgundy)"
          strokeWidth="0.5"
        />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16 sm:mb-20 opacity-0">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--warm-grey)",
              opacity: 0.7,
            }}
          >
            Our Philosophy
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic max-w-3xl mx-auto leading-[1.15]"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--burgundy)",
            }}
          >
            Every toy tells a story.
          </h2>
          <p
            className="mt-6 text-base sm:text-lg max-w-xl mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--warm-grey)",
              lineHeight: 1.7,
            }}
          >
            We believe in the magic of childhood wonder. Our toys are designed to inspire
            curiosity, foster creativity, and create memories that last a lifetime.
          </p>
        </div>

        {/* Values Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {values.map((value) => (
            <div
              key={value.title}
              className="value-card group p-6 sm:p-8 text-center transition-all duration-500 hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(93, 46, 70, 0.03)",
                border: "1px solid rgba(93, 46, 70, 0.08)",
              }}
            >
              <div
                className="w-12 h-12 mx-auto mb-5 flex items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                style={{ backgroundColor: "rgba(93, 46, 70, 0.08)" }}
              >
                <value.icon
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: "var(--burgundy)" }}
                />
              </div>
              <h3
                className="text-lg font-bold mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--burgundy)",
                }}
              >
                {value.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--warm-grey)",
                  opacity: 0.8,
                }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
