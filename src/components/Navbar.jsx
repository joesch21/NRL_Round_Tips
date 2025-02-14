import { Link } from "react-router-dom";
import "./Navbar.css";


export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">NRL 2025</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:text-yellow-400">Home</Link>
          </li>
          <li>
            <Link to="/instructions" className="text-white hover:text-yellow-400">Instructions</Link>
          </li>
          <li>
            <Link to="/wallet" className="text-white hover:text-yellow-400">Wallet</Link>
          </li>
          <li>
            <Link to="/predictions" className="text-white hover:text-yellow-400">Predictions</Link>
          </li>
          <li>
            <Link to="/leaderboard" className="text-white hover:text-yellow-400">Leaderboard</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
