/**
 * Persist a room’s player seat id so spectator → player can reclaim without data loss.
 * Uses localStorage (not sessionStorage) so a `_blank` TV tab can still read the id.
 */

function key(code: string): string {
  return `kernelchaos.resume.${code.toUpperCase()}`;
}

export function loadResumeId(code: string): string | null {
  try {
    return localStorage.getItem(key(code));
  } catch {
    return null;
  }
}

export function saveResumeId(code: string, playerId: string): void {
  if (!playerId) return;
  try {
    localStorage.setItem(key(code), playerId);
  } catch {
    /* private mode / quota */
  }
}
