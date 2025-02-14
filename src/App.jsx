import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Round1Tips from "./Round1Tips";
import Navbar from "./components/Navbar";
import Instructions from "./pages/Instructions";
import Wallet from "./pages/Wallet";
import Predictions from "./pages/Predictions";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="App">
          <h1 className="text-3xl font-bold text-center mt-6">Round 1 Tips NFT</h1>
          <Routes>
            <Route path="/" element={<Round1Tips />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/predictions" element={<Predictions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
