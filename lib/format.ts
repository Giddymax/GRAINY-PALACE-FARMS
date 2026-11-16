const ghsFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a number of pesewas-free GHS amount as "₵1,250.00". */
export function formatGHS(amount: number): string {
  return ghsFormatter.format(amount).replace("GH₵", "₵");
}

export function formatUnit(unit: string): string {
  return unit;
}

const dateFormatter = new Intl.DateTimeFormat("en-GH", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}

/** Stable, staff-friendly application reference that includes its Ghana submission date. */
export function formatPartnerApplicationId(id: string, createdAt: string | Date): string {
  const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "0000";
  const dateStamp = `${part("year")}-${part("month")}-${part("day")}`;
  const suffix = id.replace(/-/g, "").slice(-12).toUpperCase();
  return `GPF-APP-${dateStamp}-${suffix}`;
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

/** Computes a naive reading time (words / 200wpm) from plain-text or markdown body. */
export function computeReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
