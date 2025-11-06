// src/utils/auth.js

// Sauvegarde un utilisateur dans localStorage
export const registerUser = (email, password, username) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Vérifie si l'email existe déjà
  if (users.some((u) => u.email === email)) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  const newUser = { email, password, username };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
};

// Connexion : vérifie email + mot de passe
export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Email ou mot de passe incorrect.");
  localStorage.setItem("loggedUser", JSON.stringify(user));
  return user;
};

// Déconnexion
export const logoutUser = () => {
  localStorage.removeItem("loggedUser");
};

// Récupère l’utilisateur actuellement connecté
export const getLoggedUser = () => {
  const user = localStorage.getItem("loggedUser");
  return user ? JSON.parse(user) : null;
};
