/** Order reference format: GPF{YYMMDD}-{5 random alphanumeric chars}. */
export function generateOrderReference(date: Date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GPF${yy}${mm}${dd}-${rand}`;
}

/** Lab sample reference format: LAB{YYMMDD}-{4 random alphanumeric chars}. */
export function generateLabReference(date: Date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LAB${yy}${mm}${dd}-${rand}`;
}
