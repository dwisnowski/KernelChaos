export type ActiveRoomGame = "boggle" | "scattergories";

export interface ActiveRoomRow {
  code: string;
  game: ActiveRoomGame;
  phase: string;
  playerCount: number;
  hostName: string | null;
}

export interface ActiveRoomListItem {
  code: string;
  phase: string;
  playerCount: number;
  hostName: string | null;
}

/** Drop stale directory rows (safety net if a DO never tore down). */
const STALE_MS = 2 * 60 * 60 * 1000;

export async function upsertActiveRoom(
  db: D1Database,
  row: ActiveRoomRow & { updatedAt: number },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO active_rooms (code, game, phase, player_count, host_name, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(code) DO UPDATE SET
         game = excluded.game,
         phase = excluded.phase,
         player_count = excluded.player_count,
         host_name = excluded.host_name,
         updated_at = excluded.updated_at`,
    )
    .bind(row.code, row.game, row.phase, row.playerCount, row.hostName, row.updatedAt)
    .run();
}

export async function deleteActiveRoom(db: D1Database, code: string): Promise<void> {
  await db.prepare(`DELETE FROM active_rooms WHERE code = ?`).bind(code).run();
}

export async function listActiveRooms(
  db: D1Database,
  game: ActiveRoomGame,
): Promise<ActiveRoomListItem[]> {
  const cutoff = Date.now() - STALE_MS;
  await db.prepare(`DELETE FROM active_rooms WHERE updated_at < ?`).bind(cutoff).run();

  const result = await db
    .prepare(
      `SELECT code, phase, player_count AS playerCount, host_name AS hostName
       FROM active_rooms
       WHERE game = ?
       ORDER BY updated_at DESC
       LIMIT 40`,
    )
    .bind(game)
    .all<{ code: string; phase: string; playerCount: number; hostName: string | null }>();

  return (result.results ?? []).map((r) => ({
    code: r.code,
    phase: r.phase,
    playerCount: Number(r.playerCount) || 0,
    hostName: r.hostName,
  }));
}
