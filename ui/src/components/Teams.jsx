import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prevTeams, setPrevTeam] = useState([]);
  const [tournamentName, setTournamentName] = useState("");
  const [num, setNum] = useState(0);
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const max = 12;

  useEffect(() => {
    async function getTeams() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tournaments/${tournamentId}/teams`,
        );
        const { data } = response;
        setNum(max - data.length);
        setPrevTeam(data);
      } catch (error) {
        console.log(error.response.data.error);
      }
    }
    getTeams();
  }, [tournamentId]);

  useEffect(() => {
    async function getTournaments() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tournaments/${tournamentId}`,
        );
        setTournamentName(res.data.name);
      } catch {
        console.log("failed");
      }
    }
    getTournaments();
  }, [tournamentId]);

  const handleAddTeam = () => {
    if (teams.length >= num) {
      alert("Maximum number of teams reached!");
      return;
    }
    setTeams([...teams, { name: "", screenshot: null }]);
  };

  const handleTeamChange = (index, field, value) => {
    const updatedTeams = [...teams];
    updatedTeams[index][field] = value;
    setTeams(updatedTeams);
  };

  const handleSubmitTeams = async () => {
    const isEmpty = teams.some((item) => !item.name);
    if (teams.length === 0 || isEmpty) {
      alert("Please add at least one team!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/teams`,
        { teams },
      );
      console.log(response.data);
      setLoading(false);
      alert("Teams created Successfully");
      navigate(`/tournaments/${tournamentId}/gameplay`);
      // window.location.reload();
    } catch (error) {
      console.error("Error adding teams:", error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <main className="teams">
      <div className="title">
        <h1 className="text-xl font-medium ">
          {tournamentName} <span className="px-2"> &gt;</span> Teams
        </h1>
        <button
          onClick={() => {
            handleAddTeam();
          }}
        >
          Create a new Team
        </button>
      </div>

      <i
        style={{
          fontSize: "0.7rem",
          textDecoration: "underline",
          color: "#f6b402",
        }}
      >
        maximum: {max} teams
      </i>

      {prevTeams.length > 0 && (
        <div className="lists">
          {prevTeams.map((team, index) => (
            <div key={index} className="list cursor-pointer">
              <img src="/ff.png" alt="" />
              <Link
                to={`/tournaments/${tournamentId}/results`}
                style={{ textDecoration: "none" }}
              >
                {team.name}
              </Link>
            </div>
          ))}
        </div>
      )}
      {teams.map((team, index) => (
        <div key={index} className="add">
          <input
            type="text"
            placeholder="Team Name"
            value={team.name}
            onChange={(e) => handleTeamChange(index, "name", e.target.value)}
          />
          <label htmlFor="logo"></label>
          {/* <input
            type="file"
            onChange={(e) =>
              handleTeamChange(index, "screenshot", e.target.files[0])
            }
          /> */}
        </div>
      ))}
      {/* <button onClick={handleAddTeam} style={{ display: "block" }}>
        Add Team
      </button> */}
      {teams.length > 0 && (
        <button
          onClick={handleSubmitTeams}
          className="ml-[1rem]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Teams"}
        </button>
      )}
    </main>
  );
}

export default Teams;
