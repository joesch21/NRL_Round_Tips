import teamLogos from "../utils/teamLogos";

const SelectedPredictions = ({ predictions, matches }) => {
  const selectedPredictions = predictions.filter((team) => team !== null);

  if (selectedPredictions.length === 0) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100">
      <h3 className="text-xl font-semibold text-center">📢 Your Final Predictions</h3>
      <p className="text-sm italic text-center">"The moment of truth! Here are your winning picks."</p>
      
      {predictions.map((team, index) =>
        team ? (
          <div key={index} className="selected-prediction-box flex items-center justify-between p-2 border-b">
            {teamLogos[team] && (
              <img src={`/logos/${teamLogos[team]}`} alt={team} className="team-logo w-8 h-8" />
            )}
            <p className="ml-2">{matches[index]}: <span className="font-bold">{team}</span></p>
          </div>
        ) : null
      )}
    </div>
  );
};

export default SelectedPredictions;
