export function StringTruncate(string, maxLength = 25) {
  if (string.length <= maxLength) {
    return string;
  } else {
    return string.substring(0, maxLength) + "...";
  }
}

export const dollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});