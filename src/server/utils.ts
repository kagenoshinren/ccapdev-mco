/**
 * Strip HTML tags from user input to prevent stored XSS.
 * React auto-escapes JSX, but this is defense-in-depth for the DB layer.
 */
export function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/** Clamp pagination params to safe bounds. */
export function clampPagination(page?: number, pageSize?: number): { page: number; pageSize: number } {
  const p = Math.max(1, Math.floor(page ?? 1));
  const ps = Math.min(100, Math.max(1, Math.floor(pageSize ?? 20)));
  return { page: p, pageSize: ps };
}

export function formatRelative(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) {
    return "just now";
  }
  if (mins < 60) {
    return `${mins} min ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function categorizeAction(action: string): string {
  if (action.includes("reservation") || action.includes("purge")) {
    return "Reservation";
  }
  if (action.includes("thread") || action.includes("comment")) {
    return "Forum";
  }
  if (action.includes("review")) {
    return "Review";
  }
  return "Admin";
}

export async function logError(message: string, source?: string): Promise<void> {
  try {
    const { prisma } = await import("../db.ts");
    await prisma.errorLog.create({ data: { id: crypto.randomUUID(), level: "Error", message, source } });
  } catch {
    // Silently fail — logging should never crash the app
  }
}
