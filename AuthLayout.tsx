import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "@/components/ProductCard";
import { trpc } from "@/providers/trpc";
import FooterSection from "@/sections/FooterSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlidersHorizontal } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || undefined;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">("name");
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: categories } = trpc.category.list.useQuery();
  const { data: toysData, isLoading } = trpc.toy.list.useQuery({
    categorySlug: categorySlug || undefined,
    limit: 50,
    offset: 0,
  });

  useEffect(() => {
    if (!gridRef.current || !toysData?.items.length) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".group");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [toysData]);

  const sortedToys = [...(toysData?.items || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number(a.price) - Number(b.price);
      case "price-high":
        return Number(b.price) - Number(a.price);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <main className="pt-20 sm:pt-24" style={{ backgroundColor: "var(--cream)" }}>
      {/* Header */}
      <div ref={headerRef} className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--warm-grey)",
              opacity: 0.7,
            }}
          >
            {toysData?.total || 0} Products
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--burgundy)",
            }}
          >
            {categorySlug
              ? categories?.find((c) => c.slug === categorySlug)?.name ||
                "Shop"
              : "All Toys"}
          </h1>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b" style={{ borderColor: "rgba(93,46,70,0.1)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile filter button */}
            <button
              className="md:hidden flex items-center gap-2 text-xs uppercase tracking-[0.15em] px-4 py-2 border"
              style={{
                borderColor: "var(--burgundy)",
                opacity: 0.3,
                color: "var(--burgundy)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            {/* Desktop categories */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/shop"
                className={`text-xs uppercase tracking-[0.15em] px-4 py-2 transition-all duration-300 ${
                  !categorySlug
                    ? "font-medium"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: !categorySlug
                    ? "var(--burgundy)"
                    : "transparent",
                  color: !categorySlug ? "var(--cream)" : "var(--burgundy)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                All
              </a>
              {categories?.map((cat) => (
                <a
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`text-xs uppercase tracking-[0.15em] px-4 py-2 transition-all duration-300 ${
                    categorySlug === cat.slug
                      ? "font-medium"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor:
                      categorySlug === cat.slug
                        ? "var(--burgundy)"
                        : "transparent",
                    color:
                      categorySlug === cat.slug
                        ? "var(--cream)"
                        : "var(--burgundy)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs uppercase tracking-[0.1em] px-3 py-2 bg-transparent border cursor-pointer"
            style={{
              borderColor: "rgba(93,46,70,0.2)",
              color: "var(--burgundy)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Mobile filters */}
        {mobileFiltersOpen && (
          <div className="md:hidden mt-4 flex flex-wrap gap-2">
            <a
              href="/shop"
              className="text-xs uppercase tracking-[0.15em] px-4 py-2"
              style={{
                backgroundColor: !categorySlug
                  ? "var(--burgundy)"
                  : "transparent",
                color: !categorySlug ? "var(--cream)" : "var(--burgundy)",
                fontFamily: "'DM Sans', sans-serif",
                border: "1px solid var(--burgundy)",
                opacity: !categorySlug ? 1 : 0.3,
              }}
            >
              All
            </a>
            {categories?.map((cat) => (
              <a
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="text-xs uppercase tracking-[0.15em] px-4 py-2"
                style={{
                  backgroundColor:
                    categorySlug === cat.slug
                      ? "var(--burgundy)"
                      : "transparent",
                  color:
                    categorySlug === cat.slug
                      ? "var(--cream)"
                      : "var(--burgundy)",
                  fontFamily: "'DM Sans', sans-serif",
                  border: "1px solid var(--burgundy)",
                  opacity: categorySlug === cat.slug ? 1 : 0.3,
                }}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div
                    className="aspect-[3/4] mb-4"
                    style={{ backgroundColor: "rgba(93,46,70,0.08)" }}
                  />
                  <div
                    className="h-4 w-3/4 mb-2"
                    style={{ backgroundColor: "rgba(93,46,70,0.08)" }}
                  />
                  <div
                    className="h-4 w-1/2"
                    style={{ backgroundColor: "rgba(93,46,70,0.08)" }}
                  />
                </div>
              ))}
            </div>
          ) : sortedToys.length === 0 ? (
            <div className="text-center py-20">
              <p
                className="text-lg"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--burgundy)",
                }}
              >
                No toys found in this category.
              </p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {sortedToys.map((toy, index) => (
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
          )}
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
