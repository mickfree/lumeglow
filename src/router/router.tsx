import { createBrowserRouter } from "react-router";

import { ProtectedRoute } from "../common/auth/ProtectedRoute";

import { Layout } from "../common/layout/Layout";
import { Home } from "../app/home/home";
import { Calendar } from "../app/calendar/calendar";
import { Movie } from "../app/movie/movie";
import { Login } from "../features/auth/login/pages/Login";
import { SignUp } from "../features/auth/sign-up/pages/SignUp";
import { MovieMap } from "../features/movies/pages/MovieMap";


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