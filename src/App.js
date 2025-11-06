import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pokedex from "./pages/Pokedex";
import PokemonDetail from "./pages/PokemonDetail";
import TrainerSpace from "./pages/TrainerSpace";
import PokemonCenter from "./pages/PokemonCenter";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import clickSound from "./assets/click.mp3";
import "./styles/styles.css";

function App() {
  useEffect(() => {
    const audio = new Audio(clickSound);
    const handleClick = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <Router>
      <div className="pokedex-shell">
        <Navbar />
        <div className="pokedex-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/trainer" element={<TrainerSpace />} />
            <Route path="/center" element={<PokemonCenter />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
