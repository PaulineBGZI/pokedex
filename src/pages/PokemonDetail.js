import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TypeBadge from "../components/TypeBadge";

function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evolution, setEvolution] = useState([]);
  const [evoConditions, setEvoConditions] = useState([]);

  // Liste officielle des CS de la 1ère génération
  const HM_GEN1 = ["Coupe", "Vol", "Surf", "Force", "Flash"];

  // Traduction française des objets d’évolution
  const ITEM_TRANSLATIONS = {
    "fire-stone": "Pierre Feu",
    "water-stone": "Pierre Eau",
    "thunder-stone": "Pierre Foudre",
    "leaf-stone": "Pierre Plante",
    "moon-stone": "Pierre Lune",
    "sun-stone": "Pierre Soleil",
    "dusk-stone": "Pierre Nuit",
    "dawn-stone": "Pierre Aube",
    "shiny-stone": "Pierre Éclat",
    "ice-stone": "Pierre Glace",
    "king's-rock": "Roche Royale",
    "metal-coat": "Peau Métal",
    "upgrade": "Améliorator",
    "dragon-scale": "Écaille Draco",
    "deep-sea-tooth": "Dent Océan",
    "deep-sea-scale": "Écaille Océan",
    "protector": "Protecteur",
    "reaper-cloth": "Tissu Fauche",
    "magmarizer": "Magmariseur",
    "electirizer": "Électriseur",
    "oval-stone": "Pierre Ovale",
    "razor-claw": "Griffe Rasoir",
    "razor-fang": "Croc Rasoir",
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const details = await res.json();

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const speciesData = await speciesRes.json();

        const frenchName =
          speciesData.names.find((n) => n.language.name === "fr")?.name ||
          details.name;

        const description =
          speciesData.flavor_text_entries.find(
            (e) => e.language.name === "fr"
          )?.flavor_text.replace(/\f/g, " ") ||
          "Aucune description disponible.";

        // --- Évolutions ---
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const evoChain = [];
        const evoConditionsTemp = [];
        let evo = evoData.chain;

        do {
          const evoId = evo.species.url.split("/")[6];
          const evoSpeciesRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${evoId}`
          );
          const evoSpeciesData = await evoSpeciesRes.json();
          const evoFrenchName =
            evoSpeciesData.names.find((n) => n.language.name === "fr")?.name ||
            evo.species.name;

          evoChain.push({
            id: evoId,
            name: evoFrenchName,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId}.png`,
          });

          if (evo.evolves_to.length > 0) {
            const conditions = evo.evolves_to[0].evolution_details[0];
            if (conditions) {
              let condText = "";

              if (conditions.min_level)
                condText = `Évolue au niveau ${conditions.min_level}`;
              else if (conditions.item) {
                const itemName = ITEM_TRANSLATIONS[conditions.item.name]
                  ? ITEM_TRANSLATIONS[conditions.item.name]
                  : conditions.item.name
                      .replace("-", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                condText = `Évolue avec ${itemName}`;
              } else if (conditions.trigger.name === "trade")
                condText = "Évolue par échange";
              else if (conditions.trigger.name === "use-item")
                condText = "Évolue avec un objet spécifique";
              else if (conditions.trigger.name === "happiness")
                condText = "Évolue par bonheur";
              else if (conditions.trigger.name === "level-up")
                condText = "Évolue en montant de niveau";
              else condText = "Condition d’évolution inconnue";

              evoConditionsTemp.push(condText);
            }
          }

          evo = evo.evolves_to[0];
        } while (evo);

        // --- Statistiques ---
        const stats = details.stats.map((s) => ({
          name:
            s.stat.name
              .replace("special-attack", "Attaque Spé.")
              .replace("special-defense", "Défense Spé.")
              .replace("speed", "Vitesse")
              .replace("hp", "PV")
              .replace("attack", "Attaque")
              .replace("defense", "Défense"),
          value: s.base_stat,
        }));

        // --- Attaques ---
        const movesByLevel = [];
        const movesByMachine = [];

        for (const move of details.moves) {
          const relevantDetails = move.version_group_details.find(
            (v) =>
              v.version_group.name === "red-blue" &&
              (v.move_learn_method.name === "level-up" ||
                v.move_learn_method.name === "machine")
          );

          if (!relevantDetails) continue;

          const moveRes = await fetch(move.move.url);
          const moveData = await moveRes.json();
          const frenchNameMove =
            moveData.names.find((n) => n.language.name === "fr")?.name ||
            moveData.name;

          if (relevantDetails.move_learn_method.name === "level-up") {
            movesByLevel.push({
              name:
                frenchNameMove.charAt(0).toUpperCase() +
                frenchNameMove.slice(1),
              level: relevantDetails.level_learned_at,
            });
          }

          if (relevantDetails.move_learn_method.name === "machine") {
            const cleanName =
              frenchNameMove.charAt(0).toUpperCase() + frenchNameMove.slice(1);
            const isHM = HM_GEN1.includes(cleanName);
            movesByMachine.push({
              name: cleanName,
              type: isHM ? "CS" : "CT",
            });
          }
        }

        movesByLevel.sort((a, b) => a.level - b.level);
        movesByMachine.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "CT" ? -1 : 1; // CT avant CS
        });

        // --- Types ---
        const types = details.types.map((t) => {
          const typeMap = {
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
          return typeMap[t.type.name] || t.type.name;
        });

        setPokemon({
          id: details.id,
          name: frenchName,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png`,
          types,
          description,
          taille: (details.height / 10).toFixed(1),
          poids: (details.weight / 10).toFixed(1),
          stats,
          movesByLevel,
          movesByMachine,
        });

        setEvolution(evoChain);
        setEvoConditions(evoConditionsTemp);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <h2>Chargement du Pokémon...</h2>;

  return (
    <div className="pokemon-detail">
      <Link to="/pokedex">
        <button>Retour</button>
      </Link>

      <h1>
        #{pokemon.id} {pokemon.name}
      </h1>
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="pokemon-detail-img"
      />

      <div className="type-section">
        {pokemon.types.map((t, i) => (
          <TypeBadge key={i} type={t} />
        ))}
      </div>

      <p className="pokemon-description">{pokemon.description}</p>

      <h3>Détails</h3>
      <p>Taille : {pokemon.taille} m</p>
      <p>Poids : {pokemon.poids} kg</p>

      <h3>Statistiques</h3>
      <div className="stats-container">
        {pokemon.stats.map((s, i) => (
          <div key={i} className="stat-row">
            <span className="stat-name">{s.name}</span>
            <div className="stat-bar">
              <div
                className="stat-fill"
                style={{ width: `${(s.value / 150) * 100}%` }}
              ></div>
            </div>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      <h3>Attaques apprises par niveau</h3>
      <ul className="attack-list">
        {pokemon.movesByLevel.length > 0 ? (
          pokemon.movesByLevel.map((m, i) => (
            <li key={i}>
              {m.name} {m.level > 0 && <small>(Niv. {m.level})</small>}
            </li>
          ))
        ) : (
          <li>Aucune attaque par niveau.</li>
        )}
      </ul>

      <h3>Attaques apprises par CT/CS</h3>
      <ul className="attack-list">
        {pokemon.movesByMachine.length > 0 ? (
          pokemon.movesByMachine.map((m, i) => (
            <li key={i}>
              {m.name} <small>({m.type})</small>
            </li>
          ))
        ) : (
          <li>Aucune attaque par CT/CS.</li>
        )}
      </ul>

      {evoConditions.length > 0 && (
        <>
          <h3>Conditions d’évolution</h3>
          <ul className="attack-list">
            {evoConditions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </>
      )}

      <h3>Évolutions</h3>
      <div className="evolution-chain">
        {evolution.map((evo) => (
          <div key={evo.id} className="evo-card">
            <Link to={`/pokemon/${evo.id}`}>
              <img src={evo.image} alt={evo.name} />
            </Link>
            <p>{evo.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonDetail;
