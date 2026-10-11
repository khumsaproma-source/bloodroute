/**
 * Thai formatting helpers for distances, durations, and backend timestamps.
 * Backend distances are meters (bigint), durations are seconds (bigint),
 * and timestamps are nanoseconds (bigint).
 */

/** Format a distance in meters as Thai "เมตร" or "กิโลเมตร". */
export function formatDistance(meters: number | bigint): string {
  const value = typeof meters === "bigint" ? Number(meters) : meters;
  if (!Number.isFinite(value) || value < 0) return "—";
  if (value < 1000) {
    return `${Math.round(value)} เมตร`;
  }
  const km = value / 1000;
  return `${km.toFixed(km < 10 ? 1 : 0)} กิโลเมตร`;
}

/** Format a duration in seconds as Thai "นาที" or "ชั่วโมง". */
export function formatDuration(seconds: number | bigint): string {
  const value = typeof seconds === "bigint" ? Number(seconds) : seconds;
  if (!Number.isFinite(value) || value < 0) return "—";
  const minutes = Math.round(value / 60);
  if (minutes < 60) {
    return `${minutes} นาที`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} ชั่วโมง` : `${hours} ชั่วโมง ${rest} นาที`;
}

/** Convert a Motoko nanosecond timestamp to a Date, or null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a backend timestamp as a Thai short date-time, or "—". */
export function formatTimestamp(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a unit count with a Thai "ยูนิต" suffix. */
export function formatUnits(units: number | bigint): string {
  const value = typeof units === "bigint" ? Number(units) : units;
  return `${value.toLocaleString("th-TH")} ยูนิต`;
}
