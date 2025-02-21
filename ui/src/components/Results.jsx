import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaMedal } from "react-icons/fa6";

const Results = () => {
  const { tournamentId } = useParams();
  const [results, setResults] = useState([]);
  const [current, setCurrent] = useState(false);

  useEffect(() => {
    async function getResults() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tournaments/${tournamentId}/results`,
        );
        setResults(response.data.results);
        console.log(response.data.results);
        setCurrent(response.data.currentGameplay);
      } catch {
        console.log("failed");
      }
    }
    getResults();
  }, [tournamentId]);
  return (
    <main className="results">
      <div className="title">
        <h1>Results</h1>
      </div>
      <p className="py-2">
        {" "}
        <span className="text-xl font-[800]">{current}</span> out of 5 Gameplays
        Completed
      </p>

      <div className="result-lists">
        <div className="row">
          <h4>TEAM</h4>
          <h4>BOOYAH!</h4>
          <h4>PLACEMENT POINTS</h4>
          <h4>KILL COUNT</h4>
          <h4>TOTAL POINTS</h4>
        </div>
        {results &&
          results.map((item, index) => {
            const first = index === 0;
            return (
              <div
                className={first && current > 0 ? "text-[1.3rem] text-[#FFD700] row" : "row"}
                key={index}
              >
                <div className="medal">
                  {index === 0 && current > 0 ? (
                    <FaMedal color="#FFD700" />
                  ) : index === 1 && current > 0 ? (
                    <FaMedal color="#C0C0C0" />
                  ) : index === 2 && current > 0 ? (
                    <FaMedal color="#CD7F32" />
                  ) : (
                    ""
                  )}
                </div>
                <h5>{item.teamName}</h5>
                <h5>{item.booyahCount}</h5>
                <h5>{item.placementPoints}</h5>
                <h5>{item.killcount}</h5>
                <h5>{item.totalPoints}</h5>
              </div>
            );
          })}
      </div>
    </main>
  );
};
export default Results;
