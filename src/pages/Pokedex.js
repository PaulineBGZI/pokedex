import React, { useEffect, useState } from "react";
import PokemonCard from "../components/PokemonCard";

function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Tous");
  const [sortOption, setSortOption] = useState("id-asc");

  // Traduction FR des types Pokémon
  const TYPE_TRANSLATIONS = {
    fire: "Feu",
    water: "Eau",
    grass: "Plante",
    electric: "Électrik",
    ice: "Glace",
    fighting: "Combat",
    poison: "Poison",
    ground: "Sol",
    flying: "Vol",
    psychic: "Psy",
    bug: "Insecte",
    rock: "Roche",
    ghost: "Spectre",
    dragon: "Dragon",
    dark: "Ténèbres",
    steel: "Acier",
    fairy: "Fée",
    normal: "Normal",
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const limit = 151; // 1ère génération
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        const data = await response.json();

        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();

            const speciesRes = await fetch(
              `https://pokeapi.co/api/v2/pokemon-species/${details.id}`
            );
            const speciesData = await speciesRes.json();
            const frenchName =
              speciesData.names.find((n) => n.language.name === "fr")?.name ||
              details.name;

            return {
              id: details.id,
              name: frenchName,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png`,
              types: details.types.map(
                (t) => TYPE_TRANSLATIONS[t.type.name] || t.type.name
              ),
            };
          })
        );

        setPokemons(detailedData);
        setFilteredPokemons(detailedData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement du Pokédex :", error);
      }
    };

    fetchPokemons();
  }, []);

  // --- Filtrage et tri dynamique ---
  useEffect(() => {
    let filtered = [...pokemons];

    // Filtre texte (nom ou id)
    if (search.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toString() === search
      );
    }

    // Filtre par type
    if (selectedType !== "Tous") {
      filtered = filtered.filter((p) => p.types.includes(selectedType));
    }

    // --- Tri ---
    switch (sortOption) {
      case "id-asc":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "id-desc":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name, "fr"));
        break;
      case "type-asc":
        filtered.sort((a, b) =>
          (a.types[0] || "").localeCompare(b.types[0] || "", "fr")
        );
        break;
      default:
        break;
    }

    setFilteredPokemons(filtered);
  }, [search, selectedType, sortOption, pokemons]);

  if (loading) {
    return <h2>Chargement du Pokédex...</h2>;
  }

  // Liste des types disponibles
  const uniqueTypes = [
    "Tous",
    ...Array.from(new Set(pokemons.flatMap((p) => p.types))),
  ];

  return (
    <div>
      <h1>Pokédex – 1ʳᵉ Génération</h1>

      {/* Barre de recherche + filtres + tri */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Rechercher un Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {uniqueTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="id-asc"># ID croissant</option>
          <option value="id-desc"># ID décroissant</option>
          <option value="name-asc">Nom (A → Z)</option>
          <option value="name-desc">Nom (Z → A)</option>
          <option value="type-asc">Type (A → Z)</option>
        </select>
      </div>

      {/* Résultats */}
      <div className="pokemon-grid">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((p) => <PokemonCard key={p.id} {...p} />)
        ) : (
          <p>Aucun Pokémon trouvé 😿</p>
        )}
      </div>
    </div>
  );
}

export default Pokedex;
