import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SlCloudUpload } from "react-icons/sl";

function Gameplay() {
  const [screenshots, setScreenshots] = useState({});
  const { tournamentId } = useParams();
  const [teams, setTeams] = useState([]);
  const [gameplayCount, setGamePlayCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getTeams() {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tournaments/${tournamentId}/teams`,
        );
        setTeams(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.error);
        setError(error.response.data.error);
        setLoading(false);
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

  useEffect(() => {
    async function getGamePlayCount() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tournaments/${tournamentId}/gameplaycount`,
        );
        setGamePlayCount(response.data.gamePlayCount);
      } catch (error) {
        console.log(error.response.data.error);
      }
    }
    getGamePlayCount();
  }, [tournamentId]);

  const handleScreenshotChange = (teamName, file) => {
    setScreenshots({ ...screenshots, [teamName]: file });
  };

  const handleSubmitGameplay = async () => {
    if (gameplayCount >= 5) {
      alert("Maximum number of gameplay submissions reached!");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    for (const [teamName, screenshot] of Object.entries(screenshots)) {
      formData.append("screenshots", screenshot);
      formData.append("teamNames[]", teamName);
    }

    if (!([...formData.entries()].length === teams.length * 2)) {
      setSubmitting(false);
      alert("Upload a Gameplay screenshot for all teams!");
    }

    try {
      await axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/gameplay`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setSubmitting(false);
      alert("upload complete");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading gameplay:", error);
      setSubmitting(false);
    }
  };

  return (
    <main className="gameplay">
      <div className="title">
        <h1 className="text-xl font-medium ">
          {tournamentName} <span className="px-2"> &gt;</span> Upload Gameplay
        </h1>
        <button
          onClick={() => {
            navigate(`/tournaments/${tournamentId}/results`);
          }}
        >
          Show Results
        </button>
      </div>
      <p className="py-2">
        {" "}
        <span className="text-xl font-[800]">{gameplayCount}</span> out of 5
        Gameplays Completed
      </p>
      <div className="lists">
        {teams &&
          teams.map((team, index) => {
            const isChosen = screenshots[team.name] ? true : false;
            return (
              <div
                key={index}
                className={isChosen ? "list border border-[#f6b402]" : "list"}
              >
                <p>{team.name}</p>

                <label htmlFor={`screenshot-${index}`} className="">
                  <div className="flex items-center gap-2 border border-zinc-500 py-1 px-2 rounded-lg text-[0.6rem]">
                    <h5>{isChosen ? "update gameplay" : "upload gameplay"}</h5>
                    <SlCloudUpload size={20} />
                  </div>
                </label>
                <input
                  type="file"
                  id={`screenshot-${index}`}
                  onChange={(e) =>
                    handleScreenshotChange(team.name, e.target.files[0])
                  }
                />
                <p>{screenshots[team.name] && screenshots[team.name].name} </p>
              </div>
            );
          })}
      </div>
      {loading && <p>Loading teams...</p>}
      {!loading && !error && (
        <button
          onClick={handleSubmitGameplay}
          style={{ marginTop: "2rem" }}
          disabled={submitting}
          className="ml-4 submit"
        >
          {submitting ? "Submitting..." : "Submit Gameplay"}
        </button>
      )}

      {error && <p>{error}</p>}
    </main>
  );
}

export default Gameplay;
