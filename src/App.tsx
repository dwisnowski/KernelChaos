import { Navigate, Route, Routes } from "react-router-dom";
import { BoggleEntry } from "./pages/BoggleEntry.tsx";
import { BoggleRoom } from "./pages/BoggleRoom.tsx";
import { Home } from "./pages/Home.tsx";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boggle" element={<BoggleEntry />} />
      <Route path="/boggle/join" element={<BoggleEntry />} />
      <Route path="/boggle/room/:code" element={<BoggleRoom />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
