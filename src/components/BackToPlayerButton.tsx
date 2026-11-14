import { Link } from "react-router-dom";

interface Props {
  roomCode: string;
  /** Game path slug — defaults to boggle for existing callers. */
  game?: "boggle" | "scattergories";
  className?: string;
}

/** Returns from the TV spectator screen to the player room for this code. */
export function BackToPlayerButton({
  roomCode,
  game = "boggle",
  className = "btn tv-link",
}: Props) {
  return (
    <Link className={className} to={`/${game}/room/${roomCode}`}>
      Back to player mode
    </Link>
  );
}
