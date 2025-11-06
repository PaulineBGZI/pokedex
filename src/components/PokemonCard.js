import React from "react";
import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";

function PokemonCard({ id, name, image, types }) {
  return (
    <div className="pokemon-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <div>
        {types.map((t, i) => (
          <TypeBadge key={i} type={t} />
        ))}
      </div>
      <Link to={`/pokemon/${id}`}>
        <button>Afficher plus</button>
      </Link>
    </div>
  );
}

export default PokemonCard;
