import { CODE_ALPHABET } from "./boggle/protocol.ts";
import { fetchBoggleStats } from "./boggle/stats.ts";
import { GameRoom } from "./room.ts";

export { GameRoom };

function randomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  let code = "";
  for (const b of bytes) {
    code += CODE_ALPHABET[b % CODE_ALPHABET.length]!;
  }
  return code;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, app: "kernelchaos" });
    }

    if (url.pathname === "/api/boggle/stats" && request.method === "GET") {
      try {
        const stats = await fetchBoggleStats(env.STATS_DB);
        return Response.json(stats);
      } catch (err) {
        console.error("boggle stats failed", err);
        return Response.json({ error: "Could not load stats" }, { status: 500 });
      }
    }

    if (url.pathname === "/api/rooms" && request.method === "POST") {
      for (let attempt = 0; attempt < 12; attempt++) {
        const code = randomCode();
        const stub = env.GAME_ROOMS.getByName(code);
        const init = await stub.fetch(
          new Request("https://room/init", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ code }),
          }),
        );
        if (init.ok) {
          return Response.json({ code });
        }
      }
      return Response.json({ error: "Could not create room" }, { status: 503 });
    }

    const roomMatch = url.pathname.match(/^\/api\/room\/([A-Z1-9]{4})$/i);
    if (roomMatch) {
      const code = roomMatch[1]!.toUpperCase();
      const stub = env.GAME_ROOMS.getByName(code);
      return stub.fetch(request);
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
