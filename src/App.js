import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pokedex from "./pages/Pokedex";
import PokemonDetail from "./pages/PokemonDetail";
import TrainerSpace from "./pages/TrainerSpace";
import PokemonCenter from "./pages/PokemonCenter";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import backgroundMusic from "./assets/Title.mp3";
import "./styles/styles.css";

function App() {
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // ✅ Initialiser l'audio une seule fois
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(backgroundMusic);
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;
    }

    // Si activé, jouer la musique
    if (isMusicPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }

    // On NE la recrée PAS à chaque changement
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    setIsMusicPlaying((prev) => !prev);
  };

  return (
    <Router>
      <div className="pokedex-shell">
        <Navbar />

        {/* ✅ Bouton musique accessible partout */}
        <button
          onClick={toggleMusic}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 9999,
            background: "rgba(42,117,187,0.9)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 12px",
            cursor: "pointer",
            fontFamily: "Press Start 2P, cursive",
            fontSize: "9px",
          }}
        >
          {isMusicPlaying ? "🔇 Stop" : "🎵 Play"}
        </button>

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
