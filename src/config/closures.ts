/**
 * When the farm is closed to reservations.
 *
 * - CLOSED_WEEKDAYS uses JS getDay() values: 0=Sun, 1=Mon, ..., 6=Sat.
 * - CLOSED_DATES holds explicit overrides in YYYY-MM-DD format
 *   (e.g. holidays or fully-booked days).
 *
 * Edit this file to update reservation availability — no code in
 * components or the API endpoint needs to change.
 */

export const CLOSED_WEEKDAYS: number[] = [1]; // Lundi

export const CLOSED_DATES: string[] = [
  // "2026-05-01", // exemple : Fête du travail
];

export interface ClosureCheck {
  closed: boolean;
  reason?: string;
}

/** Returns { closed, reason } for a given YYYY-MM-DD string. */
export function isClosed(dateString: string): ClosureCheck {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return { closed: true, reason: "Date invalide." };
  }

  // Parse at noon local to avoid edge cases around midnight / DST.
  const d = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return { closed: true, reason: "Date invalide." };
  }

  if (CLOSED_WEEKDAYS.includes(d.getDay())) {
    return { closed: true, reason: "Nous sommes fermés le lundi." };
  }

  if (CLOSED_DATES.includes(dateString)) {
    return {
      closed: true,
      reason: "Nous sommes malheureusement complets ou fermés ce jour-là.",
    };
  }

  return { closed: false };
}
