import { useState } from "react";
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

  if (isOpen !== true) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function enviarFormulario(formData: any) {
    const datos = {
      id: dataFormulario.id,
      cliente: formData.get("cliente"),
      monto: Number(formData.get("monto")),
      metodoPago: formData.get("metodoPago"),
      barberoId: Number(formData.get("barbero")),
      hora: formatearHora(formData.get("hora")),
    };

    try {
      const respuesta = await fetch("http://localhost:3000/api/corte", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) throw new Error("Error al registrar el corte");

      const dataDelBackend = await respuesta.json();
      console.log("Respuesta del servidor:", dataDelBackend);
      corteEditado(dataDelBackend);
      actualizarTabla(dataDelBackend);
    } catch (error) {
      console.log("Error:", error);
      alert("Hubo un error al actualizar el corte");
    }
  }

  function formatearHora(hora: string) {
    const horaNueva = new Date();
    const [horas, minutos] = hora.split(":");
    horaNueva.setHours(parseInt(horas), parseInt(minutos), 0, 0);
    return horaNueva.toISOString();
  }

  function formatearHoraInput(hora: Date) {
    const horas = String(hora.getHours()).padStart(2, "0");
    const minutos = String(hora.getMinutes()).padStart(2, "0");
    const horaString = horas + ":" + minutos;
    console.log(horaString);
    return horaString;
  }

  const actualizarTabla = (element: CorteResponse) => {
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
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Registrar corte
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Completá los datos del corte realizado.
            </p>
          </div>

          <form action={enviarFormulario} className="space-y-5 p-6">
            <div>
              <label
                htmlFor="barbero"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Barbero
              </label>
              <select
                defaultValue={dataFormulario.barbero.id}
                name="barbero"
                id="barbero"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="2">Juan</option>
                <option value="3">Dofe</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="cliente"
                className="mb-2 block text-sm font-medium text-gray-700"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="monto"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Monto
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
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
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="metodoPago"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Método de pago
                </label>
                <select
                  defaultValue={dataFormulario.metodoPago}
                  name="metodoPago"
                  id="metodoPago"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="mercado_pago">Mercado Pago</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="hora"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Hora del corte
              </label>
              <input
                type="time"
                name="hora"
                id="hora"
                required
                defaultValue={formatearHoraInput(dataFormulario.hora)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="border-t border-gray-200 pt-5">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  type="button"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800"
                >
                  Guardar Actualizacion
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
