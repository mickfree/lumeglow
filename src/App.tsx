import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import Intro from "./common/intro/Intro";
import { AuthProvider } from "./common/context/AuthContext";
import { CalendarProvider } from "./common/context/CalendarContext";

export default function App() {
  const [showApp, setShowApp] = useState(() => {
    // verificar si el usuario ha visto la intro
    return localStorage.getItem("lumeglow_intro_seen") === "true";
  });

  // función que se ejecuta cuando el usuario presiona el botón de empezar
  const handleStart = () => {
    localStorage.setItem("lumeglow_intro_seen", "true");
    setShowApp(true);
  };

  if (!showApp) {
    // Si el usuario no ha visto la intro, muestra la intro
    return <Intro onStart={handleStart} />;
  }

  return (
    <AuthProvider>
      <CalendarProvider>
        <RouterProvider router={router} />
      </CalendarProvider>
    </AuthProvider>
  );
}