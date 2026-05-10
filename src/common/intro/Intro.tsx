import { useState } from "react";
import "./Intro.css";

interface IntroProps {
  onStart: (target: string) => void;
}

export default function Intro({ onStart }: IntroProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleChange = (target: string) => {
    setIsExiting(true);
    setTimeout(() => {
      onStart(target);
    }, 1200); // Duración de la animación de subida
  };

  return (
    <div className={`intro-wrapper ${isExiting ? "exit-active" : ""}`}>
      <div className="intro-hero"></div>
      <div className="intro-content">
        <h1
          className="text-6xl sm:text-8xl md:text-[120px] lg:text-[150px] font-bold"
          data-text="LUMEGLOW"
        >
          <span className="text-static">LUME</span>
          <span className="text-glow">GLOW</span>
        </h1>

        <div className="intro-description">
          <p>CARTELERA EXCLUSIVA Y PRÓXIMOS ESTRENOS CINEMATOGRÁFICOS</p>
          <p>ACCESO AL CALENDARIO GLOBAL DE LANZAMIENTOS</p>
        </div>

        <div className="flex justify-center items-center gap-6">
          <button
            className="px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-lg hover:bg-zinc-100 hover:text-zinc-800"
            onClick={() => handleChange("/login")}
          >
            Login
          </button>
          <button
            className="px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-lg hover:bg-zinc-100 hover:text-zinc-800"
            onClick={() => handleChange("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}