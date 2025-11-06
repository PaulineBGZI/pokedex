import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Accueil</Link>
      <Link to="/pokedex">Pokédex</Link>
      <Link to="/trainer">Espace Dresseur</Link>
      <Link to="/center">Centre Pokémon</Link>
      <Link to="/stats">Statistiques</Link>
      <Link to="/login">Connexion</Link>
    </nav>
  );
}

export default Navbar;
