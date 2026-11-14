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

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
