import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const raw = window.localStorage.getItem("fd-auth-user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  function persist(u) {
    setUser(u);
    window.localStorage.setItem("fd-auth-user", JSON.stringify(u));
  }

  function login({ email, name }) {
    persist({
      name: name || "Gouthami",
      email,
    });
  }

  function signup({ name, email }) {
    persist({
      name: name || "Gouthami",
      email,
    });
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem("fd-auth-user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}