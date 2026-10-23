import { useState, useEffect } from "react";

// @ts-ignore
export function FormularioCorte({ isOpen, onClose, onCorteGuardado }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [horaActual, setHoraActual] = useState("");

  // Obtener hora actual en formato HH:mm para autocompletar el campo
  useEffect(() => {
    if (isOpen) {
      const ahora = new Date();
      const horas = String(ahora.getHours()).padStart(2, "0");
      const minutos = String(ahora.getMinutes()).padStart(2, "0");
      setHoraActual(`${horas}:${minutos}`);
    }
  }, [isOpen]);

  // Manejo de la tecla Escape para cerrar el modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // @ts-ignore
  async function enviarFormulario(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    let datos = {
      cliente: formData.get("cliente"),
      monto: Number(formData.get("monto")),
      metodoPago: formData.get("metodoPago"),
      barberoId: Number(formData.get("barbero")),
      hora: formatearHora(formData.get("hora")),
    };

    try {
      const respuesta = await fetch("http://localhost:3000/api/corte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) throw new Error("Error al registrar el corte");

      const dataDelBackend = await respuesta.json();
      onCorteGuardado(dataDelBackend);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al guardar el corte");
    } finally {
      setIsSubmitting(false);
    }
  }

  // @ts-ignore
  function formatearHora(horaStr) {
    let horaNueva = new Date();
    if (horaStr) {
      const [horas, minutos] = horaStr.split(":");
      horaNueva.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0, 0);
    }
    return horaNueva.toISOString();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      {/* Fondo clickeable para cerrar */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Tarjeta Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-10 overflow-hidden">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Registrar Corte
            </h2>
            <p className="text-[11px] text-slate-500">
              Ingresa las especificaciones de la transacción
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
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

        {/* Formulario */}
        <form onSubmit={enviarFormulario} className="space-y-4 p-5">
          {/* Barbero */}
          <div>
            <label
              htmlFor="barbero"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Barbero
            </label>
            <select
              name="barbero"
              id="barbero"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="2">Juan</option>
              <option value="3">Dofe</option>
            </select>
          </div>

          {/* Cliente */}
          <div>
            <label
              htmlFor="cliente"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Cliente
            </label>
            <input
              type="text"
              name="cliente"
              id="cliente"
              placeholder="Nombre del cliente"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {/* Monto y Método de Pago */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="monto"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Monto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  name="monto"
                  id="monto"
                  placeholder="0"
                  min="0"
                  required
                  className="w-full rounded-lg border border-slate-300 py-2 pl-7 pr-3 text-xs font-bold text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="metodoPago"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Método de pago
              </label>
              <select
                name="metodoPago"
                id="metodoPago"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="efectivo">Efectivo</option>
                <option value="mercado_pago">Mercado Pago</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
          </div>

          {/* Hora */}
          <div>
            <label
              htmlFor="hora"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Hora del corte
            </label>
            <input
              type="time"
              name="hora"
              id="hora"
              defaultValue={horaActual}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {/* Acciones */}
          <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
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
                  Guardando...
                </span>
              ) : (
                "Registrar Corte"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
