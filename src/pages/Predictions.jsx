import React from "react";
import "../styles/predictions_styles.css";

const predictions = [
  { match: "Raiders vs Warriors", chatGPT: "New Zealand Warriors 18 – 26 Canberra Raiders", deepSeek: "New Zealand Warriors 24 – 20 Canberra Raiders", gemini: "New Zealand Warriors 24-18 Canberra Raiders" },
  { match: "Panthers vs Sharks", chatGPT: "Penrith Panthers 26 – 20 Cronulla-Sutherland Sharks", deepSeek: "Penrith Panthers 28 – 16 Cronulla-Sutherland Sharks", gemini: "Penrith Panthers 28-20 Cronulla-Sutherland Sharks" },
  { match: "Roosters vs Broncos", chatGPT: "Sydney Roosters 24 – 18 Brisbane Broncos", deepSeek: "Sydney Roosters 26 – 22 Brisbane Broncos", gemini: "Brisbane Broncos 26-22 Sydney Roosters" },
  { match: "Tigers vs Knights", chatGPT: "Newcastle Knights 30 – 18 Wests Tigers", deepSeek: "Newcastle Knights 18 – 12 Wests Tigers", gemini: "Newcastle Knights 20-16 Wests Tigers" },
  { match: "Dolphins vs Rabbitohs", chatGPT: "South Sydney Rabbitohs 20 – 10 Dolphins", deepSeek: "South Sydney Rabbitohs 30 – 14 Dolphins", gemini: "South Sydney Rabbitohs 30-18 Dolphins" },
  { match: "Dragons vs Bulldogs", chatGPT: "Canterbury-Bankstown Bulldogs 10 – 24 St. George Illawarra Dragons", deepSeek: "Canterbury-Bankstown Bulldogs 20 – 18 St. George Illawarra Dragons", gemini: "Canterbury-Bankstown Bulldogs 22-14 St. George Illawarra Dragons" },
  { match: "Sea Eagles vs Cowboys", chatGPT: "Manly-Warringah Sea Eagles 24 – 14 North Queensland Cowboys", deepSeek: "Manly-Warringah Sea Eagles 24 – 14 North Queensland Cowboys", gemini: "North Queensland Cowboys 24-20 Manly-Warringah Sea Eagles" },
  { match: "Eels vs Storm", chatGPT: "Melbourne Storm 24 – 12 Parramatta Eels", deepSeek: "Melbourne Storm 20 – 12 Parramatta Eels", gemini: "Melbourne Storm 26-20 Parramatta Eels" }
];

export default function Predictions() {
  return (
    <div className="predictions-container">
      <h2 className="predictions-header">🤖 AI Match Predictions</h2>
      <p className="predictions-subtext">Comparison of AI-generated predictions for upcoming NRL matches:</p>
      <table className="predictions-table">
        <thead>
          <tr>
            <th>Match</th>
            <th>ChatGPT Prediction</th>
            <th>DeepSeek Prediction</th>
            <th>Gemini Prediction</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => (
            <tr key={index}>
              <td>{prediction.match}</td>
              <td>{prediction.chatGPT}</td>
              <td>{prediction.deepSeek}</td>
              <td>{prediction.gemini}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
