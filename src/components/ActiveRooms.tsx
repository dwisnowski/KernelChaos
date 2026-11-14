import { useEffect, useState } from "react";

export interface ActiveRoomListItem {
  code: string;
  phase: string;
  playerCount: number;
  hostName: string | null;
}

function phaseLabel(phase: string): string {
  if (phase === "results") return "Between rounds";
  return "Lobby";
}

export function ActiveRooms({
  game,
  onSelect,
}: {
  game: "boggle" | "scattergories" | "mmmms";
  onSelect: (code: string) => void;
}) {
  const [rooms, setRooms] = useState<ActiveRoomListItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/rooms?game=${game}`);
        if (!res.ok) return;
        const data = (await res.json()) as { rooms?: ActiveRoomListItem[] };
        if (!cancelled) setRooms(data.rooms ?? []);
      } catch {
        /* soft-fail */
      }
    }

    void load();
    const id = window.setInterval(() => void load(), 5000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [game]);

  if (!rooms || rooms.length === 0) return null;

  return (
    <div className="active-rooms" aria-label="Open rooms">
      <span className="active-rooms-label">Open rooms</span>
      <ul className="active-rooms-list">
        {rooms.map((room) => (
          <li key={room.code}>
            <button
              type="button"
              className="active-room-btn"
              onClick={() => onSelect(room.code)}
            >
              <span className="active-room-code">{room.code}</span>
              <span className="active-room-meta">
                {phaseLabel(room.phase)}
                {" · "}
                {room.playerCount === 1 ? "1 player" : `${room.playerCount} players`}
                {room.hostName ? ` · ${room.hostName}` : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
