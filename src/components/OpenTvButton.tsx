interface Props {
  roomCode: string;
  /** Game path slug — defaults to boggle for existing callers. */
  game?: "boggle" | "scattergories";
  className?: string;
}

/** Opens the TV spectator screen for this room in a new window/tab. */
export function OpenTvButton({
  roomCode,
  game = "boggle",
  className = "btn tv-link",
}: Props) {
  return (
    <a
      className={className}
      href={`/${game}/room/${roomCode}/tv`}
      target="_blank"
      rel="noreferrer"
    >
      Open TV spectator
    </a>
  );
}
