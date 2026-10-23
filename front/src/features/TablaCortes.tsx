import { format } from "@formkit/tempo";
import type { CorteItem } from "../types/CorteItem";
import { useEffect, useState } from "react";
import type { CorteResponse } from "../types/CorteResponse";
import { FormularioCorte } from "./FormularioCorte";
import { FormularioEditar } from "./FormularioEditar";

export function TablaCortes({
  url,
  onSeActualizo,
}: {
  url: string;
  onSeActualizo: (seActualizo: boolean) => void;
}) {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [data, setData] = useState<CorteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recargar, setRecargar] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [corteSeleccionado, setCorteSeleccionado] = useState<CorteItem | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((dataResponse: CorteResponse[]) => {
        if (Array.isArray(dataResponse)) {
          const dataNueva: CorteItem[] = dataResponse.map((element) => ({
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
          }));
          setData(dataNueva);
        }
      })
      .catch((err) => setError(err.message || "Error al cargar los cortes"))
      .finally(() => setLoading(false));
  }, [url, recargar]);

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

    setData((prevData) => [nuevoCorteItem, ...prevData]);
    onSeActualizo(true);
  };

  const actualizarTablaModificada = (element: CorteResponse) => {
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

    setData((prevData) =>
      prevData.map((c) => (c.id === nuevoCorteItem.id ? nuevoCorteItem : c)),
    );
  };

  function borrarElemento(id: number) {
    fetch("http://localhost:3000/api/corte", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err))
      .finally(() => {
        setRecargar((prev) => prev + 1);
        onSeActualizo(true);
      });
  }

  const editarCorte = (id: number) => {
    const corteAEditar = data.find((c) => c.id === id);
    if (corteAEditar) {
      setCorteSeleccionado(corteAEditar);
      setIsModalOpen(true);
    }
  };

  const getMetodoPagoBadge = (metodo: string) => {
    const m = metodo?.toLowerCase() || "";
    if (m.includes("efectivo")) {
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    } else if (m.includes("transferencia") || m.includes("tarjeta")) {
      return "bg-indigo-50 text-indigo-700 ring-indigo-700/10";
    } else if (m.includes("mp") || m.includes("mercado")) {
      return "bg-sky-50 text-sky-700 ring-sky-600/20";
    }
    return "bg-slate-100 text-slate-700 ring-slate-500/10";
  };

  return (
    <div className="w-full bg-white">
      <div className="border-b border-slate-100 px-4 py-3 sm:px-5 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Cortes Realizados
          </h3>
          <p className="text-[11px] text-slate-500">
            Historial de registros y transacciones
          </p>
        </div>

        <button
          onClick={() => setEstaAbierto(true)}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20"
        >
          <span className="text-sm font-bold leading-none">+</span> Registrar
          Corte
        </button>
      </div>

      <FormularioCorte
        isOpen={estaAbierto}
        onClose={() => setEstaAbierto(false)}
        onCorteGuardado={actualizarTabla}
      />

      <div className="w-full overflow-x-auto max-h-110 overflow-y-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5">Barbero</th>
              <th className="px-4 py-2.5">Cliente</th>
              <th className="px-4 py-2.5">Monto Total</th>
              <th className="px-4 py-2.5">Barbería</th>
              <th className="px-4 py-2.5">Comisión</th>
              <th className="px-4 py-2.5">Método Pago</th>
              <th className="px-4 py-2.5">Hora</th>
              <th className="px-4 py-2.5">Día</th>
              <th className="px-4 py-2.5 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800"></span>
                    <span>Cargando transacciones...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-red-500 font-medium"
                >
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No hay cortes registrados en este período.
                </td>
              </tr>
            ) : (
              data.map((corte) => (
                <tr
                  key={corte.id}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                        {corte.barbero.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span>{corte.barbero.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    {corte.cliente}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    ${new Intl.NumberFormat("de-DE").format(corte.monto)}
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-semibold">
                    $
                    {new Intl.NumberFormat("de-DE").format(corte.montoBarberia)}
                  </td>
                  <td className="px-4 py-3 text-indigo-700 font-semibold">
                    $
                    {new Intl.NumberFormat("de-DE").format(
                      corte.comisionBarbero,
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${getMetodoPagoBadge(
                        corte.metodoPago,
                      )}`}
                    >
                      {corte.metodoPago}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-medium">
                    {format(corte.hora, { time: "short" })}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-medium">
                    {format(corte.hora, "short")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => editarCorte(corte.id)}
                        type="button"
                        className="rounded-md px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => borrarElemento(corte.id)}
                        type="button"
                        className="rounded-md px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && corteSeleccionado && (
        <FormularioEditar
          key={corteSeleccionado.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          datosForm={corteSeleccionado}
          corteEditado={actualizarTablaModificada}
        />
      )}
    </div>
  );
}
