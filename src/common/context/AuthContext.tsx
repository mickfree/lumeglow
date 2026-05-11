import { createContext, useState, useEffect, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../apis/supabase/supabase";

//datos extraidos de supabase auth
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // verificamos si el usuario esta logueado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtenemos la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchamos los cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // INITIAL_SESSION para evitar race conditions
      if (event !== 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    return () => {
      // Cancelamos la suscripción
      subscription.unsubscribe();
    };
  }, []);
  // Cerramos sesión
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    // Proporcionamos el contexto de autenticación
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
