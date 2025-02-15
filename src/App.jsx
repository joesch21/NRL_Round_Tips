import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Round1Tips from "./Round1Tips";
import Navbar from "./components/Navbar";
import Instructions from "./pages/Instructions";
import Wallet from "./pages/Wallet";
import Predictions from "./pages/Predictions";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close the menu when navigating
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <div>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="App">
          <h1 className="text-3xl font-bold text-center mt-6">Select your Winner!</h1>
          <Routes>
            <Route path="/" element={<Round1Tips closeMenu={closeMenu} />} />
            <Route path="/instructions" element={<Instructions closeMenu={closeMenu} />} />
            <Route path="/wallet" element={<Wallet closeMenu={closeMenu} />} />
            <Route path="/predictions" element={<Predictions closeMenu={closeMenu} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
