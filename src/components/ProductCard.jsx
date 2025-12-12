import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

function ProductCard({ product, highlight = false }) {
  const { dispatch } = useCart();

  const lowStock = product.stock !== null && product.stock <= 3;
  const stockLabel = lowStock ? "Low stock" : "In stock";

  function handleAddToCart(e) {
    e.preventDefault();
    dispatch({ type: "ADD_ITEM", payload: { product } });
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900/70 \
              shadow-[0_10px_30px_rgba(2,6,23,0.7)] outline-none transition transform-gpu \
              hover:-translate-y-0.5 hover:border-slate-700/80 hover:bg-slate-900/85 \
              hover:shadow-[0_16px_40px_rgba(2,6,23,0.6)] focus-visible:ring-2 brutal-border glass"
    >
      {/* Image / hero area */}
      <div className="product-gradient rgb-glow relative h-36 overflow-hidden rounded-3xl border-b border-slate-800/60">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(129,140,248,0.45),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.35),transparent_45%)] opacity-70 group-hover:opacity-100" />
        )}

        <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-indigo-200 ring-1 ring-indigo-400/30">
          {product.stock > 0 ? "In stock" : "Out"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-slate-50">
              {product.name}
            </h3>
            <p className="text-xs text-slate-400">
              {product.brand?.name || "Brand"} ·{" "}
              {product.category?.name || "Category"}
            </p>
          </div>

          {/* Right-top badges */}
          <div className="flex flex-col items-end gap-1">
            {highlight && (
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-300 ring-1 ring-indigo-400/50">
                Top pick
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                lowStock
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/50"
                  : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/50"
              }`}
            >
              {stockLabel}
            </span>
          </div>
        </div>

        {/* Rating fake stars */}
        <div className="flex items-center gap-1 text-[10px] text-amber-300">
          <span>★★★★★</span>
          <span className="text-slate-500">(demo rating)</span>
        </div>

        {/* Bottom row: price + button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-50">
            {formatPrice(product.price)}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="px-4 py-2 rounded-full btn-gradient text-white text-sm font-medium"
          >
            Add to cart
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
