import { Routes, Route } from "react-router-dom";
// import AdminDashboard from "./components/AdminDashboard";
import Tournament from "./components/Tournaments";
import Teams from "./components/Teams";
import Gameplay from "./components/Gameplay";
import Results from "./components/Results";
import DefaultHeader from "./components/DefaultHeader";

const App = () => {
  return (
    <div>
      <DefaultHeader/>
      <div className="">
        <img src="/freefirebg.jpg" alt="" className="cover" />
      </div>
      <Routes>
        {/* <Route path="/" element={<AdminDashboard />} /> */}
        <Route path="/" element={<Tournament/>} />
        <Route path="/tournaments/:tournamentId/teams" element={<Teams/>} />
        <Route path="/tournaments/:tournamentId/gameplay" element={<Gameplay />} />
        <Route path="/tournaments/:tournamentId/results" element={<Results />} />

      </Routes>
    </div>
  );
};
export default App;
