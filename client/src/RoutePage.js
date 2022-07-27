import { Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./Dashboard";

export default function RoutePage() {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/search" element={<App />} />
        </Routes>
      </div>
    </div>
  );
}
