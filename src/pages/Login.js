import React from "react";

function Login() {
  return (
    <div className="login-page">
      <h1>Connexion</h1>
      <div className="login-card">
        <input type="text" placeholder="Nom d'utilisateur" />
        <input type="password" placeholder="Mot de passe" />
        <button>Se connecter</button>
      </div>
    </div>
  );
}

export default Login;
