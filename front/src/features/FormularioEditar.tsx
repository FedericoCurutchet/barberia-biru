import { useState, useEffect } from "react";
import type { CorteItem } from "../types/CorteItem";
import type { CorteResponse } from "../types/CorteResponse";

export function FormularioEditar({
  isOpen,
  onClose,
  datosForm,
  corteEditado,
}: {
  isOpen: boolean;
  onClose: () => void;
  datosForm: CorteItem;
  corteEditado: (datosBackend: CorteResponse) => void;
}) {
  const [dataFormulario, setDataFormulario] = useState<CorteItem>(datosForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  useEffect(() => {
    setDataFormulario(datosForm);
  }, [datosForm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function enviarFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setGuardadoExitoso(false);

    const formData = new FormData(e.currentTarget);

    const datos = {
      id: dataFormulario.id,
      cliente: formData.get("cliente"),
      monto: Number(formData.get("monto")),
      metodoPago: formData.get("metodoPago"),
      barberoId: Number(formData.get("barbero")),
      hora: formatearHora(
        formData.get("hora") as string,
        formData.get("dia") as string,
      ),
    };

    try {
      const respuesta = await fetch("http://localhost:3000/api/corte", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) throw new Error("Error al actualizar el corte");

      const dataDelBackend: CorteResponse = await respuesta.json();
      corteEditado(dataDelBackend);
      actualizarTablaState(dataDelBackend);

      setGuardadoExitoso(true);
      setTimeout(() => {
        setGuardadoExitoso(false);
      }, 2500);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al actualizar el corte");
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatearHora(hora: string, fecha: string) {
    const fechaNueva = formatearFechaForm(fecha);
    const horaNueva = new Date(fechaNueva);
    const [horas, minutos] = hora.split(":");
    horaNueva.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0, 0);
    return horaNueva.toISOString();
  }

  function formatearHoraInput(hora: Date) {
    const h = new Date(hora);
    const horas = String(h.getHours()).padStart(2, "0");
    const minutos = String(h.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
  }

  function formatearFecha(fecha: Date) {
    const d = new Date(fecha);
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  }

  function formatearFechaForm(fecha: string) {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    return new Date(anio, mes - 1, dia);
  }

  const actualizarTablaState = (element: CorteResponse) => {
    const nuevoCorteItem: CorteItem = {
      id: element.id,
      cliente: element.cliente,
      monto: element.monto,
      montoBarberia: element.montoBarberia,
      comisionBarbero: element.comisionBarbero,
      metodoPago: element.metodoPago,
      hora: new Date(element.hora),
      barbero: {
        nombre: element.barbero.nombre,
        id: element.barbero.id,
      },
    };
    setDataFormulario(nuevoCorteItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-10 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Editar Corte</h2>
            <p className="text-[11px] text-slate-500">
              Modifica los detalles del registro #{dataFormulario.id}
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

        <form onSubmit={enviarFormulario} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="barbero"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Barbero
            </label>
            <select
              defaultValue={dataFormulario.barbero.id}
              name="barbero"
              id="barbero"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="2">Juan</option>
              <option value="3">Dofe</option>
            </select>
          </div>

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
              defaultValue={dataFormulario.cliente ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

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
                  defaultValue={dataFormulario.monto ?? ""}
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
                defaultValue={dataFormulario.metodoPago}
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                required
                defaultValue={formatearHoraInput(dataFormulario.hora)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label
                htmlFor="dia"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Día del corte
              </label>
              <input
                type="date"
                name="dia"
                id="dia"
                required
                defaultValue={formatearFecha(dataFormulario.hora)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cerrar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || guardadoExitoso}
              className={`inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all duration-300 focus:outline-none focus:ring-2 ${
                guardadoExitoso
                  ? "bg-emerald-600 hover:bg-emerald-600 focus:ring-emerald-600/20"
                  : "bg-slate-900 hover:bg-slate-800 focus:ring-slate-900/20"
              } disabled:opacity-90`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Guardando...
                </span>
              ) : guardadoExitoso ? (
                <span className="flex items-center gap-1.5 animate-fadeIn">
                  <svg
                    className="h-3.5 w-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  ¡Actualización Guardada!
                </span>
              ) : (
                "Guardar Actualización"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
