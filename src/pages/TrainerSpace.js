import React, { useState, useEffect } from "react";
import "../styles/TrainerSpace.css";
import { getLoggedUser } from "../utils/auth";

function TrainerSpace() {
  const user = getLoggedUser();

  // État du dresseur
  const [trainer, setTrainer] = useState({
    name: "Sacha",
    teamName: "Équipe Kanto",
    team: [],
    badges: [],
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Clé unique selon l'utilisateur
  const storageKey = `trainerData_${user?.email || "guest"}`;

  // ✅ Badges officiels de Kanto
  const badgesList = [
    { name: "Roche", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/1.png" },
    { name: "Cascade", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/2.png" },
    { name: "Foudre", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/3.png" },
    { name: "Prisme", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/4.png" },
    { name: "Âme", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/5.png" },
    { name: "Marais", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/6.png" },
    { name: "Volcan", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/7.png" },
    { name: "Terre", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/8.png" },
  ];

  // ✅ Charger les données spécifiques à l'utilisateur
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTrainer((prev) => ({
          ...parsed,
          name: user?.username || parsed.name || "Sacha",
        }));
        console.log("📦 Données chargées pour :", storageKey);
      } catch (e) {
        console.error("Erreur parsing trainerData :", e);
      }
    } else {
      console.log("🆕 Aucune donnée trouvée, création d’un profil neuf :", storageKey);
    }
    setIsLoaded(true);
  }, [user]); // recharge à chaque changement d’utilisateur

  // ✅ Sauvegarde automatique des données de ce dresseur uniquement
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...trainer,
          name: user?.username || trainer.name,
        })
      );
      console.log("💾 Données sauvegardées dans :", storageKey);
    }
  }, [trainer, isLoaded, user]);

  // ✅ Charger les Pokémon depuis la PokéAPI
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();

        const detailedData = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            const detail = await res.json();
            const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${detail.id}`);
            const speciesData = await speciesRes.json();
            const frenchName =
              speciesData.names.find((n) => n.language.name === "fr")?.name || detail.name;

            return {
              id: detail.id,
              name: frenchName,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`,
            };
          })
        );

        setPokemons(detailedData);
        setFilteredPokemons(detailedData);
      } catch (error) {
        console.error("Erreur de chargement des Pokémon :", error);
      }
    };

    fetchPokemons();
  }, []);

  // 🔍 Filtrage Pokémon
  useEffect(() => {
    if (!search.trim()) setFilteredPokemons(pokemons);
    else {
      setFilteredPokemons(
        pokemons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, pokemons]);

  // ➕ Ajouter un Pokémon
  const addPokemon = (p) => {
    if (trainer.team.length >= 6) {
      alert("Ton équipe est déjà complète (6 Pokémon max) !");
      return;
    }
    if (trainer.team.find((x) => x.id === p.id)) {
      alert(`${p.name} est déjà dans ton équipe !`);
      return;
    }

    setTrainer({ ...trainer, team: [...trainer.team, p] });
    setShowAddModal(false);
  };

  // ❌ Supprimer un Pokémon
  const removePokemon = (id) => {
    setTrainer({
      ...trainer,
      team: trainer.team.filter((p) => p.id !== id),
    });
  };

  // 📝 Renommer l’équipe
  const renameTeam = () => {
    const newName = prompt("Entre un nouveau nom d’équipe :", trainer.teamName);
    if (newName) setTrainer({ ...trainer, teamName: newName });
  };

  const progression = Math.round((trainer.team.length / 6) * 100);

  return (
    <div className="trainer-space">
      <div className="trainer-card">
        <h2>Dresseur</h2>
        <h3>{trainer.name}</h3>
        <h4>{trainer.teamName}</h4>

        <div className="button-bar">
          <button onClick={() => setShowAddModal(true)}>➕ Ajouter Pokémon</button>
          <button onClick={renameTeam}>📝 Renommer</button>
        </div>

        <h4>Équipe actuelle</h4>
        <div className="team-grid">
          {trainer.team.length === 0 && <p>Aucun Pokémon ajouté.</p>}
          {trainer.team.map((p) => (
            <div key={p.id} className="team-card">
              <img src={p.image} alt={p.name} />
              <p>{p.name}</p>
              <button className="remove-btn" onClick={() => removePokemon(p.id)}>
                Retirer
              </button>
            </div>
          ))}
        </div>

        <h4>Badges obtenus</h4>
        <div className="badges-grid">
          {badgesList.map((badge) => (
            <div key={badge.name} className="badge" title={badge.name}>
              <img src={badge.icon} alt={badge.name} />
            </div>
          ))}
        </div>

        <div className="progress-section">
          <h4>Progression du Dresseur</h4>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progression}%` }}></div>
          </div>
          <p>{progression}% complet</p>
        </div>
      </div>

      {/* ✅ Fenêtre modale d’ajout */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content pokedex-modal">
            <div className="modal-header">
              <h3>Ajouter un Pokémon</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ❌ Annuler
              </button>
            </div>

            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <div className="pokemon-list">
              {filteredPokemons.map((p) => (
                <div key={p.id} className="pokemon-item" onClick={() => addPokemon(p)}>
                  <img src={p.image} alt={p.name} />
                  <p>
                    #{p.id} {p.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerSpace;
