import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartData } = trpc.cart.get.useQuery();
  const items = cartData?.items || [];
  const total = cartData?.total || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);

    // Simulate checkout process
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/checkout/success");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <main className="pt-20 sm:pt-24 min-h-[80vh] flex items-center justify-center" style={{ backgroundColor: "var(--cream)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
            Your Cart is Empty
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--warm-grey)" }}>
            Add some toys before checking out.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium"
            style={{ backgroundColor: "var(--burgundy)", color: "var(--cream)" }}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 sm:pt-24" style={{ backgroundColor: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-8 transition-opacity hover:opacity-60"
          style={{ color: "var(--burgundy)", fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft size={14} />
          Back to Cart
        </button>

        <h1
          className="text-3xl sm:text-4xl font-bold mb-10"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact */}
              <div className="pb-6 border-b" style={{ borderColor: "rgba(93,46,70,0.1)" }}>
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}
                >
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                    style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                    style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                  />
                </div>
              </div>

              {/* Shipping */}
              <div className="pb-6 border-b" style={{ borderColor: "rgba(93,46,70,0.1)" }}>
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}
                >
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Address line 1"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                    style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                  />
                  <input
                    type="text"
                    placeholder="Address line 2 (optional)"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                    style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                      style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="State / Province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                      style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                      style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                    />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] transition-colors"
                      style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}
                >
                  Payment
                </h2>
                <div
                  className="p-6 border flex items-center gap-3"
                  style={{ borderColor: "rgba(93,46,70,0.15)", backgroundColor: "rgba(93,46,70,0.02)" }}
                >
                  <CreditCard size={20} style={{ color: "var(--burgundy)", opacity: 0.5 }} />
                  <span className="text-sm" style={{ color: "var(--warm-grey)" }}>
                    Stripe Checkout will be available after placing the order
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--burgundy)",
                  color: "var(--cream)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div
              className="p-6 sm:p-8 sticky top-24"
              style={{ backgroundColor: "rgba(93,46,70,0.03)", border: "1px solid rgba(93,46,70,0.08)" }}
            >
              <h2
                className="text-lg font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}
              >
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-[#EDE8DA]">
                      <img
                        src={item.toyImageUrl}
                        alt={item.toyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--burgundy)" }}>
                        {item.toyName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--warm-grey)", opacity: 0.6 }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}
                    >
                      ${(Number(item.toyPrice) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t space-y-2" style={{ borderColor: "rgba(93,46,70,0.1)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--warm-grey)" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--warm-grey)" }}>Shipping</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", color: "var(--teal)" }}>
                    Free
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t" style={{ borderColor: "rgba(93,46,70,0.1)" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
                    Total
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
