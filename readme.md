# KernelChaos

Family games over the internet — a [Wild Idea Zone](https://www.wildideazone.com/) project.

- Live: [https://kernelchaos.wildideazone.com](https://kernelchaos.wildideazone.com)
- Hub: [https://www.wildideazone.com/projects/kernelchaos](https://www.wildideazone.com/projects/kernelchaos)

## Games

**Boggle** — create a room, share a 4-character code or QR, pick 4×4 / 5×5 / 6×6, then drag letters on the same timed board. Scores tally at the end.

## Develop

```bash
make install
make run
```

Open the printed local URL (use the LAN IP from a phone). API health: `/api/health`.

```bash
make lint
make build
make deploy   # Cloudflare Workers → kernelchaos.wildideazone.com
```
