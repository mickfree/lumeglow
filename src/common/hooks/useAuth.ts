import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
