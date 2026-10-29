import type React from "react";
import type { Usuario } from "../types/Usuario";

export function FormularioEditarUsuario({
  cerrarModal,
  usuario,
}: {
  cerrarModal: () => void;
  usuario: Usuario;
}) {
  async function enviarFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const datosUsuario = {
      id: usuario.id,
      nombre: form.get("nombre"),
      nombreUsuario: form.get("nombreUsuario"),
      email: form.get("email"),
      contrasena: form.get("contrasena") || undefined, // Si está vacío, no se envía para mantener la actual
      rol: form.get("rol"),
    };

    try {
      await fetch("http://localhost:3000/api/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario),
      });
      cerrarModal();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      {/* Fondo clickeable para cerrar */}
      <div className="fixed inset-0" onClick={cerrarModal} />

      {/* Tarjeta Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-10 overflow-hidden">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Editar Usuario
            </h2>
            <p className="text-[11px] text-slate-500">
              Modifica los detalles del usuario #{usuario.id}
            </p>
          </div>
          <button
            onClick={cerrarModal}
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={enviarFormulario} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              defaultValue={usuario.nombre}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="nombreUsuario"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                name="nombreUsuario"
                id="nombreUsuario"
                defaultValue={usuario.nombreUsuario}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label
                htmlFor="rol"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Rol
              </label>
              <select
                name="rol"
                id="rol"
                defaultValue={usuario.rol}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="NORMAL">Normal</option>
                <option value="SOLO_REGISTRO">Solo Registro</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={usuario.email}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div>
            <label
              htmlFor="contrasena"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Nueva contraseña{" "}
              <span className="text-[10px] text-slate-400 font-normal">
                (Opcional)
              </span>
            </label>
            <input
              type="password"
              name="contrasena"
              id="contrasena"
              placeholder="Dejar en blanco para mantener la actual"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {/* Botones de acción */}
          <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
