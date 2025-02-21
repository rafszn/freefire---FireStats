import { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false)

  // Handle adding a new team input
  const addTeam = () => {
    setTeams([...teams, { name: "", screenshot: null }]);
  };

  // Handle updating team data
  const updateTeam = (index, field, value) => {
    const updatedTeams = [...teams];
    updatedTeams[index][field] = value;
    setTeams(updatedTeams);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    teams.forEach((team) => {
      formData.append(`teamNames[]`, team.name); // Append team name
      formData.append(`screenshots`, team.screenshot); // Append screenshot
    });

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response:", response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading data:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {teams.map((team, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Team Name"
            value={team.name}
            onChange={(e) => updateTeam(index, "name", e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => updateTeam(index, "screenshot", e.target.files[0])}
          />
        </div>
      ))}
      <button onClick={addTeam}>Create Team</button>
      <button onClick={handleSubmit} disabled={teams.length === 0 || loading}>
        {loading ? "Submitting..." : "Submit Teams"}
      </button>
    </div>
  );
};

export default AdminDashboard;
