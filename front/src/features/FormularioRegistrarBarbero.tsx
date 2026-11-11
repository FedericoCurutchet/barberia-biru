import type React from "react";
import { useState } from "react";
import { ModalAdminPermiso } from "./ModalAdminPermiso";

export function FormularioRegistrarBarbero({
  cerrarModal,
}: {
  cerrarModal: () => void;
}) {
  const [modalPermisoAdmin, setModalPermisoAdmin] = useState<boolean>(false);

  const [datosPendientes, setDatosPendientes] = useState<any>(null);

  const handleIniciarRegistro = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const datosBarbero = {
      nombre: form.get("nombre"),
      comision: Number(form.get("comision")),
    };

    setDatosPendientes(datosBarbero);
    setModalPermisoAdmin(true);
  };

  const handleConfirmarConAdmin = async (contrasenaAdmin: string) => {
    if (!datosPendientes) return;

    const bodyFinal = {
      ...datosPendientes,
      contrasena_admin: contrasenaAdmin,
    };

    const respuesta = await fetch("http://localhost:3000/api/barberos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(bodyFinal),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(
        errorData.error ||
          "Error al registrar el barbero o contraseña de admin inválida",
      );
    }

    setModalPermisoAdmin(false);
    cerrarModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={cerrarModal} />

      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-10 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Registrar Barbero
            </h2>
            <p className="text-[11px] text-slate-500">
              Ingresa los datos del nuevo colaborador
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

        <form onSubmit={handleIniciarRegistro} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              placeholder="Nombre del barbero"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div>
            <label
              htmlFor="comision"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Comisión (%)
            </label>
            <input
              type="number"
              name="comision"
              id="comision"
              placeholder="Ej: 50"
              min="0"
              max="100"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cerrar modal
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              Crear Barbero
            </button>
          </div>
        </form>
      </div>

      <ModalAdminPermiso
        isOpen={modalPermisoAdmin}
        onClose={() => setModalPermisoAdmin(false)}
        onConfirmar={handleConfirmarConAdmin}
        titulo="Autorizar Creación de Barbero"
        descripcion="Ingresa la contraseña de administrador para confirmar la creación del nuevo colaborador."
      />
    </div>
  );
}
