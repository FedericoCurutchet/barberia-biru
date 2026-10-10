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
  const [error, setError] = useState(null);
  const [recargar, setRecargar] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [corteSeleccionado, setCorteSeleccionado] = useState<CorteItem | null>(
    null,
  );

  useEffect(() => {
    fetch(url).then((res) =>
      res
        .json()
        .then((data: CorteResponse[]) => {
          const dataNueva: CorteItem[] = [];

          data.forEach((element: CorteResponse) => {
            const nuevo = {
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
            dataNueva.push(nuevo);
          });

          console.log(dataNueva);

          setData(dataNueva);
        })
        .catch((error) => setError(error))
        .finally(() => {
          setLoading(false);
        }),
    );
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

    setData((prevData) => {
      const nuevoArray = [...prevData, nuevoCorteItem];
      return nuevoArray;
    });
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

    const idBuscar = nuevoCorteItem.id;
    const nuevaData = data.map((c) => {
      if (c.id === idBuscar) {
        return nuevoCorteItem;
      } else {
        return c;
      }
    });

    setData(nuevaData);
  };

  function borrarElemento(id: number) {
    const datos = {
      id: id,
    };
    fetch("http://localhost:3000/api/corte", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json)
      .then((data) => console.log(data))
      .catch((error) => console.log(error))
      .finally(() => {
        setRecargar(recargar + 1);
        onSeActualizo(true);
      });
  }

  const editarCorte = (id: string | number) => {
    const corteAEditar = data.find((c) => c.id === id);
    if (corteAEditar) {
      setCorteSeleccionado(corteAEditar);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="border-b border-gray-200 px-5 py-4 flex justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Cortes realizados
          </h2>
          <p className="text-sm text-gray-500">
            Historial de cortes realizados
          </p>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => {
              setEstaAbierto(true);
              console.log({ estaAbierto });
            }}
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50 hover:text-blue-600"
          >
            Registrar Corte
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto max-h-130">
        <div>
          <FormularioCorte
            isOpen={estaAbierto}
            onClose={() => {
              setEstaAbierto(false);
            }}
            onCorteGuardado={actualizarTabla}
          ></FormularioCorte>
        </div>
        <div></div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Barbero</th>
              <th className="px-5 py-4 font-semibold">Cliente</th>
              <th className="px-5 py-4 font-semibold">Monto</th>
              <th className="px-5 py-4 font-semibold">Local</th>
              <th className="px-5 py-4 font-semibold">Barbero</th>
              <th className="px-5 py-4 font-semibold">Pago</th>
              <th className="px-5 py-4 font-semibold">Hora</th>
              <th className="px-5 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {error && <li className="p-4 text-red-800">Error: {error}</li>}
            {loading && <li className="p-4">Cargando....</li>}

            {[...data].reverse().map((corte) => (
              <tr
                key={`${corte.id}`}
                className="transition-colors duration-150 hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-medium text-gray-800">
                  {corte.barbero.nombre}
                </td>
                <td className="px-5 py-4 text-gray-600">{corte.cliente}</td>
                <td className="px-5 py-4 font-medium text-gray-800">
                  ${new Intl.NumberFormat("de-DE").format(corte.monto)}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  ${new Intl.NumberFormat("de-DE").format(corte.montoBarberia)}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  $
                  {new Intl.NumberFormat("de-DE").format(corte.comisionBarbero)}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {corte.metodoPago}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {format(corte.hora, { time: "short" })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        editarCorte(corte.id);
                      }}
                      type="button"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        borrarElemento(corte.id);
                      }}
                      type="button"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {isModalOpen && corteSeleccionado && (
              <FormularioEditar
                key={corteSeleccionado.id} // <-- ¡Clave para reiniciar el estado sin useEffect!
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                datosForm={corteSeleccionado}
                corteEditado={actualizarTablaModificada}
              />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
