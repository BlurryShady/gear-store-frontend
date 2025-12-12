// src/pages/ProductListPage.jsx
import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import ProductCard from "../components/ProductCard";

const CATEGORY_OPTIONS = [
  { id: null, label: "All gear" },
  { id: 1, label: "Mouse" },
  { id: 2, label: "Keyboard" },
  { id: 3, label: "Headset" },
  { id: 4, label: "Monitor" },
  // adjust IDs here if your category IDs are different in Django
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
];

function buildOrdering(sortValue) {
  switch (sortValue) {
    case "price_asc":
      return "price";
    case "price_desc":
      return "-price";
    case "newest":
      return "-created_at";
    default:
      return null;
  }
}

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (categoryId) {
        params.set("category", categoryId);
      }

      const ordering = buildOrdering(sort);
      if (ordering) {
        params.set("ordering", ordering);
      }

      const query = params.toString();
      const path = query ? `/products/?${query}` : "/products/";

      try {
        const data = await apiGet(path);
        setProducts(data.results || data);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [categoryId, sort]);

  const activeCategory =
    CATEGORY_OPTIONS.find((c) => c.id === categoryId) || CATEGORY_OPTIONS[0];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="hero-gradient rounded-3xl border border-indigo-500/20 px-6 py-6 shadow-[0_12px_40px_rgba(2,6,23,0.6)] sm:px-8 sm:py-7 glass brutal-border">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-indigo-200 ring-1 ring-indigo-300/40">
            Play sharper.
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Hand picked mouse, keyboards and headsets
            <br className="hidden sm:block" /> for better experience in all aspects.
          </h1>
          <p className="text-sm text-indigo-100/80">
            This store is my personal gear wishlist. No real payments, just a
            full-stack playground built with Django & React.
          </p>
        </div>
      </section>

      {/* Layout: sidebar + content */}
      <section className="grid gap-6 md:grid-cols-[220px,1fr]">
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="glass p-4 rounded-lg brutal-border">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Categories
            </h2>
            <div className="mt-3 space-y-1">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex w-full items-center justify-between rounded-full px-3 py-1.5 text-sm transition ${
                    cat.id === categoryId
                      ? "bg-slate-100 text-slate-950 font-medium"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.id === categoryId && (
                    <span className="text-[11px] uppercase text-slate-500">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products + sort */}
        <div className="space-y-4">
          {/* Top row: title + sort */}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                {activeCategory.label === "All gear"
                  ? "All gaming gear"
                  : activeCategory.label}
                <span className="ml-1 text-xs font-normal text-slate-400">
                  · {products.length} items
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-100 shadow-sm outline-none ring-indigo-500/40 focus:border-indigo-400 focus:ring-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading / error */}
          {loading && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-800 bg-slate-900/40 p-0 overflow-hidden"
                  aria-hidden="true"
                >
                  {/* image placeholder */}
                  <div className="h-36 bg-slate-800/30 animate-pulse" />

                  {/* content placeholder */}
                  <div className="p-4">
                    <div className="h-4 w-3/4 bg-slate-800/30 rounded mb-2 animate-pulse" />
                    <div className="h-3 w-1/2 bg-slate-800/30 rounded mb-4 animate-pulse" />

                    <div className="mt-auto flex items-center justify-between">
                      <div className="h-4 w-20 bg-slate-800/30 rounded animate-pulse" />
                      <div className="h-8 w-20 bg-slate-800/30 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              Error: {error}
            </p>
          )}


          {/* Grid */}
          {!loading && !error && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  highlight={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductListPage;
