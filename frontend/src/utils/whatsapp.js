export function buildWhatsAppLink(phoneNumber, message) {
  if (!phoneNumber) return null;
  const cleaned = phoneNumber.replace(/\D/g, "");
  const base = `https://wa.me/${cleaned}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
