import { Navigate, Route, Routes } from "react-router-dom";
import { BoggleEntry } from "./pages/BoggleEntry.tsx";
import { BoggleRoom } from "./pages/BoggleRoom.tsx";
import { BoggleSpectator } from "./pages/BoggleSpectator.tsx";
import { Home } from "./pages/Home.tsx";
import { MmmmsEntry } from "./pages/MmmmsEntry.tsx";
import { MmmmsRoom } from "./pages/MmmmsRoom.tsx";
import { MmmmsSpectator } from "./pages/MmmmsSpectator.tsx";
import { ScattergoriesEntry } from "./pages/ScattergoriesEntry.tsx";
import { ScattergoriesRoom } from "./pages/ScattergoriesRoom.tsx";
import { ScattergoriesSpectator } from "./pages/ScattergoriesSpectator.tsx";
import { Settings } from "./pages/Settings.tsx";
import { SpotdiffEntry } from "./pages/SpotdiffEntry.tsx";
import { SpotdiffRoom } from "./pages/SpotdiffRoom.tsx";
import { SpotdiffSpectator } from "./pages/SpotdiffSpectator.tsx";
import { SpotItEntry } from "./pages/SpotItEntry.tsx";
import { SpotItRoom } from "./pages/SpotItRoom.tsx";
import { SpotItSpectator } from "./pages/SpotItSpectator.tsx";
import { TriviaEntry } from "./pages/TriviaEntry.tsx";
import { TriviaRoom } from "./pages/TriviaRoom.tsx";
import { TriviaSpectator } from "./pages/TriviaSpectator.tsx";
import { WheelEntry } from "./pages/WheelEntry.tsx";
import { WheelRoom } from "./pages/WheelRoom.tsx";
import { WheelSpectator } from "./pages/WheelSpectator.tsx";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/boggle" element={<BoggleEntry />} />
      <Route path="/boggle/join" element={<BoggleEntry />} />
      <Route path="/boggle/room/:code" element={<BoggleRoom />} />
      <Route path="/boggle/room/:code/tv" element={<BoggleSpectator />} />
      <Route path="/scattergories" element={<ScattergoriesEntry />} />
      <Route path="/scattergories/join" element={<ScattergoriesEntry />} />
      <Route path="/scattergories/room/:code" element={<ScattergoriesRoom />} />
      <Route path="/scattergories/room/:code/tv" element={<ScattergoriesSpectator />} />
      <Route path="/mmmms" element={<MmmmsEntry />} />
      <Route path="/mmmms/join" element={<MmmmsEntry />} />
      <Route path="/mmmms/room/:code" element={<MmmmsRoom />} />
      <Route path="/mmmms/room/:code/tv" element={<MmmmsSpectator />} />
      <Route path="/spotdiff" element={<SpotdiffEntry />} />
      <Route path="/spotdiff/join" element={<SpotdiffEntry />} />
      <Route path="/spotdiff/room/:code" element={<SpotdiffRoom />} />
      <Route path="/spotdiff/room/:code/tv" element={<SpotdiffSpectator />} />
      <Route path="/spot-it" element={<SpotItEntry />} />
      <Route path="/spot-it/join" element={<SpotItEntry />} />
      <Route path="/spot-it/room/:code" element={<SpotItRoom />} />
      <Route path="/spot-it/room/:code/tv" element={<SpotItSpectator />} />
      <Route path="/wheel" element={<WheelEntry />} />
      <Route path="/wheel/join" element={<WheelEntry />} />
      <Route path="/wheel/room/:code" element={<WheelRoom />} />
      <Route path="/wheel/room/:code/tv" element={<WheelSpectator />} />
      <Route path="/trivia" element={<TriviaEntry />} />
      <Route path="/trivia/join" element={<TriviaEntry />} />
      <Route path="/trivia/room/:code" element={<TriviaRoom />} />
      <Route path="/trivia/room/:code/tv" element={<TriviaSpectator />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
