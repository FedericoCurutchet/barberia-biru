import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");

  const navigate = useNavigate();

  async function manejarLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMensaje("");

    const credenciales = {
      nombreUsuario,
      contrasena,
    };

    try {
      const res = await fetch("http://localhost:3000/api/usuarios/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (error) {
      console.error("Error en el login:", error);
      setErrorMensaje("Credenciales incorrectas");
    }
  }

  return (
    <main className="w-full bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden p-8">
        {/* Encabezado / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-lg mb-3 shadow-2xs">
            B
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistema de Gestión de Barbería
          </p>
        </div>

        {/* Mensaje de error visual si falla el login */}
        {errorMensaje && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200 text-center font-medium">
            {errorMensaje}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={manejarLogin} className="space-y-4">
          <div>
            <label
              htmlFor="nombreUsuario"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="nombreUsuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="ej. admin"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div>
            <label
              htmlFor="contrasena"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              Ingresar al Sistema
            </button>
          </div>
        </form>

        {/* Pie de tarjeta */}
        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <span className="text-[11px] text-slate-400">
            Panel de control y gestión interna
          </span>
        </div>
      </div>
    </main>
  );
}
