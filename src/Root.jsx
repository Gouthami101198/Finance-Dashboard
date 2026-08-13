import React from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import App from "./App";

export default function Root() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <App /> : <AuthPage />;
}
