import React from "react";

function Stats() {
  const stats = [
    { label: "Pokémon Mâles", value: "55%" },
    { label: "Pokémon Femelles", value: "45%" },
    { label: "Pokémon Chromatiques", value: "3" },
    { label: "Niveau moyen", value: "32" },
  ];

  return (
    <div className="stats-page">
      <h1>Statistiques du Dresseur</h1>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <h3>{s.label}</h3>
            <p>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
