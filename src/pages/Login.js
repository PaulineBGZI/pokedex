import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../utils/auth";
import "../styles/TrainerSpace.css";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        if (!username.trim()) throw new Error("Le nom d’utilisateur est obligatoire.");
        registerUser(email.trim(), password.trim(), username.trim());
        alert("Compte créé avec succès !");
        setIsRegistering(false);
      } else {
        const user = loginUser(email.trim(), password.trim());
        alert(`Bienvenue, ${user.username} !`);
        navigate("/trainer");
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{isRegistering ? "Créer un compte" : "Connexion"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegistering && (
            <input
              type="text"
              placeholder="Nom d’utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          {error && <p className="error-msg">{error}</p>}

          <button type="submit">
            {isRegistering ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <p>
          {isRegistering ? "Déjà un compte ?" : "Pas encore inscrit ?"}{" "}
          <button
            className="switch-btn"
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Se connecter" : "Créer un compte"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
