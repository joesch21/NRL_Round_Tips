import { Card, CardContent } from "./ui/Card";
import { Label } from "./ui/Label";
import teamLogos from "../utils/teamLogos";

const MatchPrediction = ({ matches, predictions, handlePredictionChange }) => {
  return (
    <>
      {matches.map((match, index) => {
        const [teamA, teamB] = match.split(" vs. ");
        return (
          <Card key={index} className="mb-2">
            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
              <Label className="text-lg font-semibold">{match}</Label>
              <div className="match-buttons">
                <button
                  className={`px-3 py-1 border rounded font-bold transition ${
                    predictions[index] === teamA ? "selected" : ""
                  }`}
                  onClick={() => handlePredictionChange(index, teamA)}
                >
                  {teamLogos[teamA] && <img src={`/logos/${teamLogos[teamA]}`} alt={teamA} className="team-logo" />}
                  {teamA}
                </button>
                <button
                  className={`px-3 py-1 border rounded font-bold transition ${
                    predictions[index] === teamB ? "selected" : ""
                  }`}
                  onClick={() => handlePredictionChange(index, teamB)}
                >
                  {teamLogos[teamB] && <img src={`/logos/${teamLogos[teamB]}`} alt={teamB} className="team-logo" />}
                  {teamB}
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default MatchPrediction;
