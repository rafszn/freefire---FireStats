import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Tournament() {
  const [tournamentName, setTournamentName] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getTournaments() {
      try {
        const res = await axios.get("http://localhost:3000/api/tournaments");
        setTournaments(res.data);
      } catch {
        console.log("failed");
      }
    }
    getTournaments();
  }, []);

  const handleCreateTournament = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/tournaments",
        { name: tournamentName },
      );
      const tournamentId = response.data.tournamentId;
      console.log({ tournamentId });
      navigate(`/tournaments/${tournamentId}/teams`);
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <main className="tournament">
      <div className="title">
        <h1 className="text-xl font-medium ">Tournaments</h1>
        <button
          onClick={() => {
            setVisible(!visible);
          }}
        >
          Create a new Tournament
        </button>
      </div>

      <div className="lists">
        {tournaments &&
          tournaments.map((tournament) => {
            return (
              <div className="list" key={tournament.id}>
                <div className="flex gap-2 items-center">
                  <h2>{tournament.name}</h2>
                  {tournament.gameplayCount === 0 ? (
                    <p className="text-[0.6rem] text-zinc-500">Not Started</p>
                  ) : tournament.gameplayCount < 5 ? (
                    <p className="text-[0.6rem] text-[#FFA500]">Ongoing</p>
                  ) : (
                    <p className="text-[0.6rem] text-[#28A745]">Completed</p>
                  )}
                </div>

                <div className="links">
                  <Link to={`/tournaments/${tournament.id}/teams`}>Teams</Link>
                  {tournament.gameplayCount < 5 && (
                    <Link to={`/tournaments/${tournament.id}/gameplay`}>
                      Upload Gameplays
                    </Link>
                  )}
                  <Link
                    to={`/tournaments/${tournament.id}/results`}
                    className="text-[#f6b402]"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            );
          })}
      </div>

      {visible && (
        <div className="add">
          <input
            type="text"
            placeholder="Tournament Name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
          />
          <button onClick={handleCreateTournament}>Create Tournament</button>
        </div>
      )}
    </main>
  );
}

export default Tournament;
