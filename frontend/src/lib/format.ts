export function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN').format(n)
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function computeDiscountPercent(price: number, discountPrice: number | null) {
  if (!discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
}

