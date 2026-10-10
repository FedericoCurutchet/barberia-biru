import { useState } from "react";

import { useFetch } from "../hooks/useFetch";

import { TablaCortes } from "../features/TablaCortes";
import { format } from "@formkit/tempo";
import { SelectorMes } from "../components/common/SelectorMes";

export function Home() {
  const l = "en";

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mes, setMes] = useState(() => new Date().getMonth());
  const [dia, setDia] = useState("hoy");

  function obtenerFechaInicio(mesParametro, dia) {
    const fechaInicio = new Date();
    fechaInicio.setMonth(mesParametro);

    console.log(dia);
    if (dia === "mes") {
      fechaInicio.setDate(1);
    }
    console.log("fechaInicio" + fechaInicio);
    return format(fechaInicio, "YYYY-MM-DD", l);
  }

  function obtenerFechaFinal(mesParametro, dia) {
    const fechaFinal = new Date();

    console.log(dia);
    if (dia === "hoy") {
      fechaFinal.setMonth(mesParametro);
    }
    if (dia === "semana") {
      const fechaHoy = new Date();
      fechaFinal.setMonth(mesParametro);
      fechaFinal.setDate(fechaHoy.getDate() + 7);
    } else if (dia === "mes") {
      fechaFinal.setMonth(mesParametro + 1);
      fechaFinal.setDate(0);
    }

    console.log("fechafinal" + fechaFinal);
    return format(fechaFinal, "YYYY-MM-DD", l);
  }

  const fechaInicio = obtenerFechaInicio(mes, dia);
  const fechaFinal = obtenerFechaFinal(mes, dia);

  const urlResumen = `http://localhost:3000/api/corte/resumenTotal?fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;
  const urlBarberos = `http://localhost:3000/api/corte/resumenBarberos?fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;
  const urlCorte = `http://localhost:3000/api/corte/cortesMes?fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;

  // @ts-ignore
  const resumen = useFetch(urlResumen, refreshTrigger);
  // @ts-ignore
  const barberos = useFetch(urlBarberos, refreshTrigger);

  // @ts-ignore
  const actualizarDatos = (seActualizo) => {
    if (seActualizo === true) {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <main className="w-full bg-gray-50 p-1">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Resumen</h1>
          <p className="mt-1 text-gray-500">
            Resumen de los cortes y ganancias de la barbería
          </p>
          <div>
            <select
              name="mes"
              id="mes"
              value={mes}
              onChange={(e) => {
                const valorNumerico = Number(e.target.value);

                setMes(valorNumerico);
              }}
            >
              <option value="0">Enero</option>
              <option value="1">Febrero</option>
              <option value="2">Marzo</option>
              <option value="3">Abril</option>
              <option value="4">Mayo</option>
              <option value="5">Junio</option>
              <option value="6">Julio</option>
              <option value="7">Agosto</option>
              <option value="8">Septiembre</option>
              <option value="9">Octubre</option>
              <option value="10">Noviembre</option>
              <option value="11">Diciembre</option>
            </select>
          </div>
          <div>
            {/* <SelectorMes onMes={(nuevoMes) => setMes(nuevoMes)}></SelectorMes> */}
            <select
              name="dia"
              id="dia"
              value={dia}
              onChange={(e) => {
                const dia = e.target.value;

                setDia(dia);
              }}
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Semana</option>
              <option value="mes">Mes</option>
            </select>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total cortes</p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              $
              {new Intl.NumberFormat("de-DE").format(
                // @ts-ignore
                resumen?._sum?.monto ?? 0,
              )}
            </p>

            <p className="mt-1 text-sm text-gray-400">Ingresos totales</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Monto barbería</p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              $
              {new Intl.NumberFormat("de-DE").format(
                // @ts-ignore
                resumen?._sum?.montoBarberia ?? 0,
              )}
            </p>

            <p className="mt-1 text-sm text-gray-400">Ganancia del local</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Monto barberos</p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              $
              {new Intl.NumberFormat("de-DE").format(
                // @ts-ignore
                resumen?._sum?.comisionBarbero ?? 0,
              )}
            </p>

            <p className="mt-1 text-sm text-gray-400">Comisiones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <section className="w-full  overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <TablaCortes
              url={urlCorte}
              onSeActualizo={actualizarDatos}
            ></TablaCortes>
          </section>

          <section className="h-fit max-h-135.7 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Barberos</h2>

              <p className="text-sm text-gray-500">
                Rendimiento de cada barbero
              </p>
            </div>

            <div className="max-h-130 overflow-y-auto ">
              {barberos.map((barbero) => (
                <div
                  key={barbero.nombre}
                  className="bg-gray-300 border-b border-gray-100 p-8 transition-colors duration-150 hover:bg-gray-100 "
                >
                  <div className="flex items-center gap-3 ">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600">
                      {barbero.nombre.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800">
                        {barbero.nombre}
                      </p>

                      <p className="text-sm text-gray-500">Barbero</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Cortes</p>

                      <p className="mt-1 text-lg font-semibold text-gray-800">
                        {barbero.cantidadCortes}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Total</p>

                      <p className="mt-1 text-lg font-semibold text-gray-800">
                        ${barbero.comisionBarbero.toLocaleString("es-AR")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
