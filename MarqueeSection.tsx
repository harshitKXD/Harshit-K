import { useRef, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "@/components/ProductCard";
import { trpc } from "@/providers/trpc";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: featuredToys } = trpc.toy.featured.useQuery();

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !gridRef.current) return;
    if (!featuredToys?.length) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Grid items staggered animation
      const cards = gridRef.current?.querySelectorAll(".group");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [featuredToys]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--warm-grey)",
                opacity: 0.7,
              }}
            >
              Handpicked for You
            </p>
            <h2
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-5xl font-bold opacity-0"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "var(--burgundy)",
              }}
            >
              Curated for Creativity
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:block text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:opacity-60 pb-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--burgundy)",
              borderBottom: "1px solid var(--burgundy)",
            }}
          >
            View All
          </Link>
        </div>

        {/* Product Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {featuredToys?.map((toy, index) => (
            <ProductCard
              key={toy.id}
              id={toy.id}
              name={toy.name}
              slug={toy.slug}
              price={toy.price}
              comparePrice={toy.comparePrice}
              imageUrl={toy.imageUrl}
              hoverImageUrl={toy.hoverImageUrl}
              ageRange={toy.ageRange}
              material={toy.material}
              index={index}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-block text-xs uppercase tracking-[0.2em] font-medium px-8 py-3 transition-all duration-300"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--cream)",
              backgroundColor: "var(--burgundy)",
            }}
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
