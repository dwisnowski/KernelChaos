interface Props {
  roomCode: string;
  className?: string;
}

/** Opens the TV spectator screen for this room in a new window/tab. */
export function OpenTvButton({ roomCode, className = "btn tv-link" }: Props) {
  return (
    <a
      className={className}
      href={`/boggle/room/${roomCode}/tv`}
      target="_blank"
      rel="noreferrer"
    >
      Open TV spectator
    </a>
  );
}
