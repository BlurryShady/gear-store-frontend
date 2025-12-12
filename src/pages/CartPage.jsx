// src/pages/CartPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { apiPost } from "../api/client";

function CartPage() {
  const { items, totalPrice, dispatch } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  async function handleCheckout(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setError("Please enter your name and email.");
      return;
    }

    const payload = {
      customer_name: customerName,
      customer_email: customerEmail,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    if (payload.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiPost("/orders/", payload);
      setSuccess(`Order #${data.id} created successfully.`);
      dispatch({ type: "CLEAR_CART" });
      setCustomerName("");
      setCustomerEmail("");
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  const isEmpty = items.length === 0;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
      {/* Left: cart items */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">Your Cart</h2>
          <span className="text-xs text-slate-400">
            {items.length} item{items.length !== 1 && "s"}
          </span>
        </header>

        {isEmpty ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/80 p-6 text-sm text-slate-300">
            <p>Your cart is empty.</p>
            <Link
              to="/"
              className="mt-3 inline-flex text-xs font-medium text-indigo-300 hover:text-indigo-200"
            >
              ← Back to products
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-slate-50">
                    {item.product.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatPrice(item.product.price)} × {item.quantity}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "CHANGE_QUANTITY",
                        payload: { id: item.product.id, delta: -1 },
                      })
                    }
                    className="h-7 w-7 rounded-full border border-slate-700 text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "CHANGE_QUANTITY",
                        payload: { id: item.product.id, delta: 1 },
                      })
                    }
                    className="h-7 w-7 rounded-full border border-slate-700 text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_ITEM",
                        payload: { id: item.product.id },
                      })
                    }
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-red-500 hover:bg-red-500/10 hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-sm">
          <span className="text-slate-400">Total</span>
          <span className="text-base font-semibold text-slate-50">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </section>

      {/* Right: checkout form */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-100">
          Checkout (demo)
        </h3>

        <form onSubmit={handleCheckout} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-500/40 focus:border-indigo-400 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-500/40 focus:border-indigo-400 focus:ring-2"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || isEmpty}
            className="w-full rounded-full bg-slate-100 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-500/50 disabled:text-slate-900/70"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>

          <div className="text-xs text-slate-500">
            This is a demo checkout. No real payments are processed – orders
            just appear in the Django admin.
          </div>

          <Link
            to="/"
            className="inline-flex text-xs font-medium text-indigo-300 hover:text-indigo-200"
          >
            ← Continue shopping
          </Link>
        </form>
      </section>
    </div>
  );
}

export default CartPage;
