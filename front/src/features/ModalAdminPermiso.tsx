import type React from "react";
import { useState, useEffect } from "react";

interface ModalAdminPermisoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (contrasenaAdmin: string) => Promise<void> | void;
  titulo?: string;
  descripcion?: string;
}

export function ModalAdminPermiso({
  isOpen,
  onClose,
  onConfirmar,
  titulo = "Autorización de Administrador",
  descripcion = "Esta acción requiere la contraseña de un administrador para continuar.",
}: ModalAdminPermisoProps) {
  const [contrasena, setContrasena] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleCerrar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  const handleCerrar = () => {
    setContrasena("");
    setError("");
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contrasena.trim()) {
      setError("Por favor ingresa la contraseña");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onConfirmar(contrasena);
      handleCerrar();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Contraseña incorrecta o error de autorización");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={!isSubmitting ? handleCerrar : undefined}
      />

      <div className="relative w-full max-w-sm rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-10 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">{titulo}</h2>
            <p className="text-[11px] text-slate-500">{descripcion}</p>
          </div>
          <button
            onClick={handleCerrar}
            disabled={isSubmitting}
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="contrasena_admin"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Contraseña de Admin
            </label>
            <input
              type="password"
              name="contrasena_admin"
              id="contrasena_admin"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-2.5 text-center text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-end gap-2">
            <button
              onClick={handleCerrar}
              type="button"
              disabled={isSubmitting}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Verificando...
                </span>
              ) : (
                "Confirmar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
