import { createBrowserRouter, Navigate } from "react-router";
import { ReactNode } from "react";

import { Layout } from "../common/layout/Layout";
import { Home } from "../app/home/home";
import { Calendar } from "../app/calendar/calendar";
import { Movie } from "../app/movie/movie";
import { Login } from "../features/auth/login/pages/Login";
import { SignUp } from "../features/auth/sign-up/pages/SignUp";
import { MovieMap } from "../features/movies/pages/MovieMap";
import { useAuth } from "../common/hooks/useAuth";

// Componente para proteger las rutas
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/",
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "calendar",
                element: <Calendar />
            },
            {
                path: "movie/:id",
                element: <Movie />
            },
            {
                path: "map",
                element: <MovieMap />
            }
        ]
    }
]);