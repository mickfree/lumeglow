import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../../../../apis/supabase/supabase";
import EyeIcon from "../../../../components/ui/icons/EyeIcon";
import EyeOffIcon from "../../../../components/ui/icons/EyeOffIcon";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Bienvenido de nuevo</h2>
          <p className="text-zinc-400">Ingresa a tu cuenta para continuar</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-900 text-red-300 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 text-white placeholder-zinc-500"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 text-white placeholder-zinc-500 pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white focus:outline-none transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <EyeOffIcon size="20px" className="text-zinc-100" />
                ) : (
                  <EyeIcon size="20px" className="text-zinc-100" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-zinc-100 text-zinc-900 font-bold rounded-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          ¿No tienes una cuenta?{" "}
          <Link to="/signup" className="text-white hover:underline focus:outline-none">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
