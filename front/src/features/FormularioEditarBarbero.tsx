import type React from "react";
import { useState } from "react";
import type { Barbero } from "../types/barbero";
import { ModalAdminPermiso } from "./ModalAdminPermiso";

export function FormularioEditarBarbero({
  barbero,
  cerrarModal,
}: {
  barbero: Barbero;
  cerrarModal: () => void;
}) {
  const [modalPermisoAdmin, setModalPermisoAdmin] = useState<boolean>(false);

  const [datosPendientes, setDatosPendientes] = useState<any>(null);

  const handleIniciarEdicion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const datosBarbero = {
      id: barbero.id,
      nombre: form.get("nombre"),
      activo: form.get("activo") === "true",
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
      method: "PUT",
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
          "Error al actualizar el barbero o contraseña de admin inválida",
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
              Editar Barbero
            </h2>
            <p className="text-[11px] text-slate-500">
              Modifica los detalles del colaborador #{barbero.id}
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

        <form onSubmit={handleIniciarEdicion} className="space-y-4 p-5">
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
              defaultValue={barbero.nombre}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
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
              min="0"
              max="100"
              defaultValue={barbero.comision}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div>
            <label
              htmlFor="activo"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Estado
            </label>
            <select
              name="activo"
              id="activo"
              defaultValue={String(barbero.activo)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
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
              Editar Barbero
            </button>
          </div>
        </form>
      </div>

      <ModalAdminPermiso
        isOpen={modalPermisoAdmin}
        onClose={() => setModalPermisoAdmin(false)}
        onConfirmar={handleConfirmarConAdmin}
        titulo="Autorizar Modificación de Barbero"
        descripcion="Ingresa la contraseña de administrador para confirmar los cambios en este colaborador."
      />
    </div>
  );
}
