import { useParams, useNavigate } from "react-router";
import { useRef, useEffect, useState } from "react";
import { trpc } from "@/providers/trpc";
import { Minus, Plus, ArrowLeft, Check, Truck, Shield, RotateCcw } from "lucide-react";
import FooterSection from "@/sections/FooterSection";
import gsap from "gsap";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const { data: toy, isLoading } = trpc.toy.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: relatedToys } = trpc.toy.featured.useQuery();

  const addMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    },
  });

  useEffect(() => {
    if (!heroRef.current || !infoRef.current || !toy) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [toy]);

  if (isLoading) {
    return (
      <main className="pt-20 sm:pt-24" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square" style={{ backgroundColor: "rgba(93,46,70,0.08)" }} />
            <div className="space-y-4">
              <div className="h-8 w-3/4" style={{ backgroundColor: "rgba(93,46,70,0.08)" }} />
              <div className="h-6 w-1/3" style={{ backgroundColor: "rgba(93,46,70,0.08)" }} />
              <div className="h-4 w-full" style={{ backgroundColor: "rgba(93,46,70,0.08)" }} />
              <div className="h-4 w-5/6" style={{ backgroundColor: "rgba(93,46,70,0.08)" }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!toy) {
    return (
      <main className="pt-20 sm:pt-24" style={{ backgroundColor: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
            Product Not Found
          </h1>
          <button
            onClick={() => navigate("/shop")}
            className="text-sm uppercase tracking-wider"
            style={{ color: "var(--burgundy)" }}
          >
            Back to Shop
          </button>
        </div>
      </main>
    );
  }

  const discount = toy.comparePrice
    ? Math.round(
        ((Number(toy.comparePrice) - Number(toy.price)) / Number(toy.comparePrice)) * 100
      )
    : null;

  const handleAddToCart = () => {
    addMutation.mutate({ toyId: toy.id, quantity });
  };

  return (
    <main className="pt-20 sm:pt-24" style={{ backgroundColor: "var(--cream)" }}>
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b" style={{ borderColor: "rgba(93,46,70,0.08)" }}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
            style={{ color: "var(--burgundy)", fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div ref={heroRef} className="opacity-0">
            <div className="aspect-square overflow-hidden bg-[#EDE8DA] relative">
              <img
                src={toy.imageUrl}
                alt={toy.name}
                className="w-full h-full object-cover"
              />
              {discount && (
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 text-xs uppercase tracking-wider font-medium"
                  style={{ backgroundColor: "var(--mustard)", color: "var(--burgundy)" }}
                >
                  {discount}% Off
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div ref={infoRef} className="flex flex-col opacity-0">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-3"
              style={{ color: "var(--warm-grey)", opacity: 0.6, fontFamily: "'DM Sans', sans-serif" }}
            >
              {toy.material} &middot; Ages {toy.ageRange}
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}
            >
              {toy.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}
              >
                ${Number(toy.price).toFixed(2)}
              </span>
              {toy.comparePrice && (
                <span
                  className="text-lg line-through"
                  style={{ fontFamily: "'Space Mono', monospace", color: "var(--warm-grey)", opacity: 0.5 }}
                >
                  ${Number(toy.comparePrice).toFixed(2)}
                </span>
              )}
            </div>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "var(--warm-grey)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}
            >
              {toy.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border" style={{ borderColor: "rgba(93,46,70,0.2)" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center transition-all hover:bg-[var(--burgundy)] hover:text-[var(--cream)]"
                  style={{ color: "var(--burgundy)" }}
                >
                  <Minus size={14} />
                </button>
                <span
                  className="w-12 text-center text-sm"
                  style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center transition-all hover:bg-[var(--burgundy)] hover:text-[var(--cream)]"
                  style={{ color: "var(--burgundy)" }}
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addMutation.isPending || addedToCart}
                className="flex-1 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{
                  backgroundColor: addedToCart ? "var(--teal)" : "var(--burgundy)",
                  color: "var(--cream)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {addedToCart ? (
                  <>
                    <Check size={16} />
                    Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: "rgba(93,46,70,0.1)" }}>
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Shield, label: "2-Year Warranty" },
                { icon: RotateCcw, label: "30-Day Returns" },
              ].map((feature) => (
                <div key={feature.label} className="text-center">
                  <feature.icon
                    size={20}
                    className="mx-auto mb-2"
                    style={{ color: "var(--burgundy)", opacity: 0.5 }}
                    strokeWidth={1.5}
                  />
                  <p
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--warm-grey)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedToys && relatedToys.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 py-16 border-t" style={{ borderColor: "rgba(93,46,70,0.08)" }}>
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-10"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}
            >
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedToys
                .filter((t) => t.id !== toy.id)
                .slice(0, 4)
                .map((relatedToy, index) => (
                  <ProductCard
                    key={relatedToy.id}
                    id={relatedToy.id}
                    name={relatedToy.name}
                    slug={relatedToy.slug}
                    price={relatedToy.price}
                    comparePrice={relatedToy.comparePrice}
                    imageUrl={relatedToy.imageUrl}
                    hoverImageUrl={relatedToy.hoverImageUrl}
                    ageRange={relatedToy.ageRange}
                    material={relatedToy.material}
                    index={index}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </main>
  );
}
