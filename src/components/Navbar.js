import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { getLoggedUser, logoutUser } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 On garde l'utilisateur dans un state pour que React le réévalue
  const [user, setUser] = useState(getLoggedUser());

  useEffect(() => {
    // 🔁 Quand l'URL change, on relit le localStorage (utile après login/logout)
    const currentUser = getLoggedUser();
    setUser(currentUser);
    console.log("🔄 Navbar mis à jour, utilisateur :", currentUser);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">🏠 Accueil</Link>
        <Link to="/pokedex">📘 Pokédex</Link>
        <Link to="/center">🏥 Centre Pokémon</Link>
        <Link to="/stats">📊 Statistiques</Link>
        <Link to="/trainer">🎒 Espace Dresseur</Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="username">👤 {user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Se déconnecter
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            🔑 Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
