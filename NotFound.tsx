import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AdminTab = "dashboard" | "toys" | "orders";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  if (authLoading) {
    return (
      <main className="pt-20 flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: "var(--cream)" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--burgundy)" }} />
      </main>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <main className="pt-20 text-center py-20" style={{ backgroundColor: "var(--cream)" }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
          Access Denied
        </h1>
        <p className="text-sm" style={{ color: "var(--warm-grey)" }}>You need admin privileges to access this page.</p>
      </main>
    );
  }

  return (
    <main className="pt-20 sm:pt-24 min-h-[100dvh]" style={{ backgroundColor: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
                { id: "toys" as AdminTab, label: "Toys", icon: Package },
                { id: "orders" as AdminTab, label: "Orders", icon: ShoppingCart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id ? "text-[var(--cream)]" : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? "var(--burgundy)" : "transparent",
                    color: activeTab === tab.id ? "var(--cream)" : "var(--burgundy)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <tab.icon size={18} strokeWidth={1.5} />
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "toys" && <ToysTab />}
            {activeTab === "orders" && <OrdersTab />}
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardTab() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--burgundy)" }} />
      </div>
    );
  }

  const statCards = [
    { label: "Total Sales", value: `$${(stats?.totalSales || 0).toFixed(2)}`, icon: DollarSign, color: "var(--teal)" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "var(--burgundy)" },
    { label: "Products", value: stats?.totalToys || 0, icon: Package, color: "var(--mustard)" },
    { label: "Growth", value: "+24%", icon: TrendingUp, color: "var(--teal)" },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-5 sm:p-6"
            style={{ backgroundColor: "rgba(93,46,70,0.03)", border: "1px solid rgba(93,46,70,0.08)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} style={{ color: stat.color, opacity: 0.7 }} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
              {stat.value}
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--warm-grey)", opacity: 0.6 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
        Recent Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(93,46,70,0.15)" }}>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Order</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Customer</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Amount</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders?.map((order: any) => (
              <tr key={order.id} style={{ borderBottom: "1px solid rgba(93,46,70,0.06)" }}>
                <td className="py-3 px-4" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                  #{order.id}
                </td>
                <td className="py-3 px-4" style={{ color: "var(--warm-grey)" }}>{order.customerName}</td>
                <td className="py-3 px-4" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                  ${Number(order.totalAmount).toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={4} className="py-8 text-center" style={{ color: "var(--warm-grey)", opacity: 0.5 }}>
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToysTab() {
  const [page, setPage] = useState(0);
  const [editingToy, setEditingToy] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;

  const utils = trpc.useUtils();
  const { data: toysData, isLoading } = trpc.admin.toy.list.useQuery({ limit: pageSize, offset: page * pageSize });
  const deleteMutation = trpc.admin.toy.delete.useMutation({
    onSuccess: () => {
      utils.admin.toy.list.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this toy?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleEdit = (toy: any) => {
    setEditingToy(toy);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingToy(null);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil((toysData?.total || 0) / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
          Toys
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.15em] font-medium transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "var(--burgundy)", color: "var(--cream)" }}
        >
          <Plus size={16} />
          Add Toy
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--burgundy)" }} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(93,46,70,0.15)" }}>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Product</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Price</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Stock</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Featured</th>
                  <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {toysData?.items.map((toy) => (
                  <tr key={toy.id} style={{ borderBottom: "1px solid rgba(93,46,70,0.06)" }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={toy.imageUrl} alt={toy.name} className="w-10 h-10 object-cover" />
                        <span style={{ color: "var(--burgundy)" }}>{toy.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                      ${Number(toy.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: toy.inStock ? "rgba(129,178,154,0.15)" : "rgba(93,46,70,0.1)",
                          color: toy.inStock ? "var(--teal)" : "var(--burgundy)",
                        }}
                      >
                        {toy.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: toy.featured ? "rgba(242,204,143,0.3)" : "transparent",
                          color: "var(--burgundy)",
                        }}
                      >
                        {toy.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(toy)}
                          className="p-1.5 transition-opacity hover:opacity-60"
                          style={{ color: "var(--burgundy)" }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(toy.id)}
                          className="p-1.5 transition-opacity hover:opacity-60"
                          style={{ color: "var(--burgundy)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 disabled:opacity-30"
                style={{ color: "var(--burgundy)" }}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 disabled:opacity-30"
                style={{ color: "var(--burgundy)" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ToyModal toy={editingToy} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function ToyModal({ toy, onClose }: { toy: any; onClose: () => void }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    name: toy?.name || "",
    slug: toy?.slug || "",
    description: toy?.description || "",
    price: toy?.price || "",
    comparePrice: toy?.comparePrice || "",
    imageUrl: toy?.imageUrl || "",
    hoverImageUrl: toy?.hoverImageUrl || "",
    categoryId: toy?.categoryId || "",
    featured: toy?.featured || false,
    inStock: toy?.inStock !== false,
    ageRange: toy?.ageRange || "",
    material: toy?.material || "",
  });
  const [saving, setSaving] = useState(false);

  const createMutation = trpc.admin.toy.create.useMutation({
    onSuccess: () => {
      utils.admin.toy.list.invalidate();
      utils.admin.stats.invalidate();
      onClose();
    },
  });

  const updateMutation = trpc.admin.toy.update.useMutation({
    onSuccess: () => {
      utils.admin.toy.list.invalidate();
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...form,
      price: String(form.price),
      comparePrice: form.comparePrice ? String(form.comparePrice) : undefined,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
    };

    if (toy) {
      await updateMutation.mutateAsync({ id: toy.id, ...data });
    } else {
      await createMutation.mutateAsync(data as any);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
            {toy ? "Edit Toy" : "Add New Toy"}
          </h2>
          <button onClick={onClose} className="p-1" style={{ color: "var(--burgundy)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)]"
            style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
          />
          <input
            type="text"
            required
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)]"
            style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
          />
          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)] resize-none"
            style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)]"
              style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
            />
            <input
              type="text"
              placeholder="Compare Price"
              value={form.comparePrice}
              onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)]"
              style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
            />
          </div>
          <input
            type="text"
            required
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)]"
            style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Age Range"
              value={form.ageRange}
              onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)]"
              style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
            />
            <input
              type="text"
              placeholder="Material"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border bg-transparent focus:outline-none focus:border-[var(--burgundy)]"
              style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--burgundy)" }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-[var(--burgundy)]"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--burgundy)" }}>
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="accent-[var(--burgundy)]"
              />
              In Stock
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: "var(--burgundy)", color: "var(--cream)" }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Toy"}
          </button>
        </form>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const utils = trpc.useUtils();
  const { data: ordersData, isLoading } = trpc.admin.order.list.useQuery({
    limit: pageSize,
    offset: page * pageSize,
  });

  const updateStatusMutation = trpc.admin.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.order.list.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  const totalPages = Math.ceil((ordersData?.total || 0) / pageSize);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "var(--burgundy)" }}>
        Orders
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--burgundy)" }} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(93,46,70,0.15)" }}>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Order</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Customer</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Amount</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Status</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--warm-grey)" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {ordersData?.items.map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid rgba(93,46,70,0.06)" }}>
                    <td className="py-3 px-4" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                      #{order.id}
                    </td>
                    <td className="py-3 px-4">
                      <div style={{ color: "var(--burgundy)" }}>{order.customerName}</div>
                      <div className="text-xs" style={{ color: "var(--warm-grey)", opacity: 0.6 }}>{order.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            orderId: order.id,
                            status: e.target.value as any,
                          })
                        }
                        className="text-xs bg-transparent border px-2 py-1 cursor-pointer"
                        style={{ borderColor: "rgba(93,46,70,0.2)", color: "var(--burgundy)" }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-xs" style={{ color: "var(--warm-grey)", opacity: 0.6 }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} className="py-8 text-center" style={{ color: "var(--warm-grey)", opacity: 0.5 }}>
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 disabled:opacity-30"
                style={{ color: "var(--burgundy)" }}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace", color: "var(--burgundy)" }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 disabled:opacity-30"
                style={{ color: "var(--burgundy)" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(242,204,143,0.2)", text: "var(--mustard)" },
    paid: { bg: "rgba(129,178,154,0.15)", text: "var(--teal)" },
    shipped: { bg: "rgba(93,46,70,0.1)", text: "var(--burgundy)" },
    delivered: { bg: "rgba(129,178,154,0.15)", text: "var(--teal)" },
    cancelled: { bg: "rgba(93,46,70,0.1)", text: "var(--mahogany)" },
  };
  const c = colors[status] || colors.pending;

  return (
    <span
      className="px-2 py-0.5 text-xs capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}
