import React from "react";

function PokemonCenter() {
  return (
    <div className="center-page">
      <h1>Centre Pokémon</h1>
      <div className="center-list">
        <div className="center-item">
          <h3>Carapuce</h3>
          <p>Soigné au Centre Pokémon de Toulouse</p>
          <p>PV récupérés : +30</p>
          <p>Température : 36°C</p>
          <p>Date : 05/11/2025 à 15:32</p>
        </div>
        <div className="center-item">
          <h3>Dracaufeu</h3>
          <p>Soigné au Centre Pokémon de Paris</p>
          <p>PV récupérés : +25</p>
          <p>Température : 38°C</p>
          <p>Date : 14/07/2025 à 11:12</p>
        </div>
      </div>
    </div>
  );
}

export default PokemonCenter;
