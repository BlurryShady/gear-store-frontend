export function formatPrice(value) {
  const amount = Number(value);
  const safe = Number.isFinite(amount) ? amount : 0;
  return `$${safe.toFixed(2)}`;
}
