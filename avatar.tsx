import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { trpc } from "@/providers/trpc";

export default function CartDrawer() {
  const { isOpen, setOpen } = useCartStore();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: cartData } = trpc.cart.get.useQuery(undefined, {
    enabled: isOpen,
  });

  // Update cart count globally
  const { data: cartCountData } = trpc.cart.get.useQuery();
  useEffect(() => {
    if (cartCountData) {
      const count = cartCountData.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      useCartStore.getState().setItemCount(count);
    }
  }, [cartCountData]);

  const removeMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
    },
  });

  const updateMutation = trpc.cart.update.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      setUpdatingId(null);
    },
  });

  const items = cartData?.items || [];
  const total = cartData?.total || 0;

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(itemId);
    updateMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemove = (itemId: number) => {
    removeMutation.mutate({ itemId });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--cream)" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(93, 46, 70, 0.15)" }}>
            <h2
              className="text-xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "var(--burgundy)",
              }}
            >
              Your Cart
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="p-2 transition-opacity hover:opacity-60"
              style={{ color: "var(--burgundy)" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <ShoppingBag size={48} strokeWidth={1} style={{ color: "var(--burgundy)", opacity: 0.3 }} />
                <p
                  className="text-sm"
                  style={{ color: "var(--warm-grey)", opacity: 0.6 }}
                >
                  Your cart is empty
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] font-medium px-6 py-3 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--burgundy)",
                    color: "var(--cream)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b"
                    style={{ borderColor: "rgba(93, 46, 70, 0.1)" }}
                  >
                    {/* Image */}
                    <Link
                      to={`/shop/${item.toySlug}`}
                      onClick={() => setOpen(false)}
                      className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm"
                    >
                      <img
                        src={item.toyImageUrl}
                        alt={item.toyName}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/shop/${item.toySlug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium line-clamp-1 hover:opacity-70 transition-opacity"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: "var(--burgundy)",
                          }}
                        >
                          {item.toyName}
                        </Link>
                        <p
                          className="text-xs mt-1"
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            color: "var(--warm-grey)",
                          }}
                        >
                          ${Number(item.toyPrice).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updatingId === item.id}
                            className="w-7 h-7 flex items-center justify-center border rounded-sm transition-all hover:bg-[var(--burgundy)] hover:text-[var(--cream)]"
                            style={{ borderColor: "var(--burgundy)", opacity: 0.3, color: "var(--burgundy)" }}
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-8 text-center text-sm"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updatingId === item.id}
                            className="w-7 h-7 flex items-center justify-center border rounded-sm transition-all hover:bg-[var(--burgundy)] hover:text-[var(--cream)]"
                            style={{ borderColor: "var(--burgundy)", opacity: 0.3, color: "var(--burgundy)" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 transition-opacity hover:opacity-60"
                          style={{ color: "var(--burgundy)", opacity: 0.5 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t" style={{ borderColor: "rgba(93, 46, 70, 0.15)" }}>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-sm uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--warm-grey)" }}
                >
                  Subtotal
                </span>
                <span
                  className="text-lg font-bold"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: "var(--burgundy)",
                  }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/checkout");
                }}
                className="w-full py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--burgundy)",
                  color: "var(--cream)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
