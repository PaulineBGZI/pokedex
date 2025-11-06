import React from "react";

function Home() {
  return (
    <div className="home-banner">
      <h1>Bienvenue dans le Pokédex Officiel</h1>
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
        alt="pokeball"
      />
      <p>
        Explorez les 151 premiers Pokémon, découvrez leurs caractéristiques, gérez votre équipe et suivez les soins de vos compagnons au Centre Pokémon !
      </p>
      <p>Commencez votre aventure dès aujourd’hui.</p>
    </div>
  );
}

export default Home;
