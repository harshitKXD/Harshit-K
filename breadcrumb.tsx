import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string | null;
  imageUrl: string;
  hoverImageUrl?: string | null;
  ageRange?: string | null;
  material?: string | null;
  index?: number;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  imageUrl,
  ageRange,
  index = 0,
}: ProductCardProps) {
  const utils = trpc.useUtils();

  const addMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addMutation.mutate({ toyId: id, quantity: 1 });
  };

  const discount = comparePrice
    ? Math.round(
        ((Number(comparePrice) - Number(price)) / Number(comparePrice)) * 100
      )
    : null;

  return (
    <div
      className="group relative"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <Link to={`/shop/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE8DA] mb-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Discount Badge */}
          {discount && (
            <div
              className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium"
              style={{
                backgroundColor: "var(--mustard)",
                color: "var(--burgundy)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {discount}% Off
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={addMutation.isPending}
            className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            style={{
              backgroundColor: "var(--burgundy)",
              color: "var(--cream)",
            }}
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
          </button>

          {/* Age Range */}
          {ageRange && (
            <div
              className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(247, 241, 227, 0.9)",
                color: "var(--burgundy)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Ages {ageRange}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          <h3
            className="text-sm font-medium line-clamp-1 group-hover:opacity-70 transition-opacity duration-300"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--burgundy)",
            }}
          >
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: "var(--burgundy)",
              }}
            >
              ${Number(price).toFixed(2)}
            </span>
            {comparePrice && (
              <span
                className="text-xs line-through"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: "var(--warm-grey)",
                  opacity: 0.5,
                }}
              >
                ${Number(comparePrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
