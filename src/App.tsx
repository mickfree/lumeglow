import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import Intro from "./common/intro/Intro";
import { AuthProvider } from "./common/context/AuthContext";
import { CalendarProvider } from "./common/context/CalendarContext";

export default function App() {
  const [showApp, setShowApp] = useState(() => {
    // Check localStorage to see if user has already seen the intro
    return localStorage.getItem("lumeglow_intro_seen") === "true";
  });

  const handleStart = () => {
    localStorage.setItem("lumeglow_intro_seen", "true");
    setShowApp(true);
  };

  if (!showApp) {
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