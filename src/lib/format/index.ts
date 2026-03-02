export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19);
};

export const formatExpiryDate = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length <= 2) return cleanValue;
  return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
};

export const detectCardBrand = (
  number: string,
): "VISA" | "MASTERCARD" | null => {
  const cleanNumber = number.replace(/\D/g, "");
  if (cleanNumber.startsWith("4")) return "VISA";
  if (/^(5[1-5]|2221|2720)/.test(cleanNumber)) return "MASTERCARD";
  return null;
};
