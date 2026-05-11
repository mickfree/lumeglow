import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../../../../apis/supabase/supabase";
import EyeIcon from "../../../../components/ui/icons/EyeIcon";
import EyeOffIcon from "../../../../components/ui/icons/EyeOffIcon";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    // validar la contraseña
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      if (data.session) {
        // Si hay una sesión, redirige al usuario a la página principal
        navigate("/");
      } else {
        // Si no hay una sesión, muestra un mensaje de confirmación
        setMessage("¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Crear Cuenta</h2>
          <p className="text-zinc-400">Regístrate para acceder al sistema</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-900 text-red-300 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-950/50 border border-green-900 text-green-300 rounded-md text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
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

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 text-white placeholder-zinc-500 pr-10"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white focus:outline-none transition-colors"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showConfirmPassword ? (
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
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-white hover:underline focus:outline-none">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
