import { Link } from "react-router";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function CheckoutSuccess() {
  return (
    <main
      className="pt-20 sm:pt-24 min-h-[80vh] flex items-center justify-center"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div className="text-center px-4 max-w-md mx-auto">
        <div
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(129, 178, 154, 0.15)" }}
        >
          <CheckCircle size={36} style={{ color: "var(--teal)" }} />
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "var(--burgundy)",
          }}
        >
          Order Confirmed!
        </h1>
        <p
          className="text-sm mb-2"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--warm-grey)",
            lineHeight: 1.7,
          }}
        >
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p
          className="text-xs mb-8"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: "var(--warm-grey)",
            opacity: 0.6,
          }}
        >
          A confirmation email will be sent shortly.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--burgundy)",
            color: "var(--cream)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
