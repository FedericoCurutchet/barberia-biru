import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { TablaCortes } from "../features/TablaCortes";

export function Resumen() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mes, setMes] = useState(() => new Date().getMonth());
  const [barberoExpandido, setBarberoExpandido] = useState(null);

  const [urlCortes, setUrlCortes] = useState(
    `http://localhost:3000/api/corte/cortesDelMes?mes=${mes}`,
  );
  const [urlResumenMes, setUrlResumenMes] = useState(
    `http://localhost:3000/api/corte/resumenTotalMes?mes=${mes}`,
  );
  const [urlResumenSemana, setUrlResumenSemana] = useState(
    "http://localhost:3000/api/corte/resumenTotalSemana",
  );
  const [urlBarberos, setUrlBarberos] = useState(
    `http://localhost:3000/api/corte/resumenBarberosMes?mes=${mes}`,
  );

  useEffect(() => {
    setUrlResumenMes(
      `http://localhost:3000/api/corte/resumenTotalMes?mes=${mes}`,
    );
    setUrlBarberos(
      `http://localhost:3000/api/corte/resumenBarberosMes?mes=${mes}`,
    );
    setUrlCortes(`http://localhost:3000/api/corte/cortesDelMes?mes=${mes}`);
  }, [mes]);

  // @ts-ignore
  const resumenMes = useFetch(urlResumenMes, refreshTrigger);
  // @ts-ignore
  const resumenSemana = useFetch(urlResumenSemana, refreshTrigger);
  // @ts-ignore
  const barberos = useFetch(urlBarberos, refreshTrigger);

  const actualizarDatos = (seActualizo) => {
    if (seActualizo === true) {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const mesesNombres = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <main className="w-full bg-slate-100 min-h-screen p-3 sm:p-5 text-slate-800">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Panel de Estadísticas
            </h1>
            <p className="text-xs text-slate-500">
              Métricas globales y rendimiento operacional
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="mes"
              className="text-xs font-semibold text-slate-500 uppercase"
            >
              Filtrar Mes:
            </label>
            <select
              name="mes"
              id="mes"
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {mesesNombres.map((nombreMes, index) => (
                <option key={index} value={index}>
                  {nombreMes}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resumen Mensual — {mesesNombres[mes]}
                </span>
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  Vista General
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Ingresos Totales
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    $
                    {new Intl.NumberFormat("de-DE").format(
                      resumenMes?._sum?.monto ?? 0,
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Monto Barbería
                  </p>
                  <p className="mt-1 text-xl font-bold text-emerald-700">
                    $
                    {new Intl.NumberFormat("de-DE").format(
                      resumenMes?._sum?.montoBarberia ?? 0,
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Comisiones Barberos
                  </p>
                  <p className="mt-1 text-xl font-bold text-indigo-700">
                    $
                    {new Intl.NumberFormat("de-DE").format(
                      resumenMes?._sum?.comisionBarbero ?? 0,
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resumen Semanal (Últimos 7 Días)
                </span>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  En curso
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Ingresos Semana
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    $
                    {new Intl.NumberFormat("de-DE").format(
                      resumenSemana?._sum?.monto ?? 0,
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Barbería Semana
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    $
                    {new Intl.NumberFormat("de-DE").format(
                      resumenSemana?._sum?.montoBarberia ?? 0,
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Barberos Semana
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    $
                    {new Intl.NumberFormat("de-DE").format(
                      resumenSemana?._sum?.comisionBarbero ?? 0,
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="border-b border-slate-100 px-4 py-3 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Histórico de Cortes
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Registros individuales correspondientes al mes de{" "}
                    {mesesNombres[mes]}
                  </p>
                </div>
              </div>
              <TablaCortes url={urlCortes} onSeActualizo={actualizarDatos} />
            </section>
          </div>

          <section className="h-fit rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden sticky top-5">
            <div className="border-b border-slate-100 px-4 py-3.5 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800">
                Rendimiento por Barbero
              </h2>
              <p className="text-[11px] text-slate-500">
                Haz clic en un barbero para desglosar métricas
              </p>
            </div>

            <div className="divide-y divide-slate-100 max-h-[calc(100vh-180px)] overflow-y-auto">
              {Array.isArray(barberos) &&
                barberos.map((barbero, index) => {
                  const estaAbierto = barberoExpandido === barbero.nombre;
                  return (
                    <div
                      key={barbero.nombre}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <button
                        onClick={() =>
                          setBarberoExpandido(
                            estaAbierto ? null : barbero.nombre,
                          )
                        }
                        className="flex w-full items-center justify-between p-3.5 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 w-4 text-center">
                            {index + 1}°
                          </span>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-2xs">
                            {barbero.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {barbero.nombre}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {barbero.cantidadCortes ?? 0} cortes realizados
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">
                              ${barbero.monto?.toLocaleString("es-AR") ?? 0}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Total bruto
                            </p>
                          </div>
                          <span
                            className={`transform transition-transform duration-200 text-slate-400 text-[10px] ${estaAbierto ? "rotate-180" : ""}`}
                          >
                            ▼
                          </span>
                        </div>
                      </button>

                      {estaAbierto && (
                        <div className="px-3.5 pb-3.5 pt-1 bg-slate-50/80 border-t border-slate-100/60 grid grid-cols-2 gap-2">
                          <div className="rounded-md border border-slate-200/80 bg-white p-2.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Cortes Totales
                            </span>
                            <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">
                              {barbero.cantidadCortes ?? 0}
                            </span>
                          </div>
                          <div className="rounded-md border border-slate-200/80 bg-white p-2.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                              Comisión Barbero
                            </span>
                            <span className="text-sm font-extrabold text-indigo-600 mt-0.5 block">
                              $
                              {barbero.comisionBarbero?.toLocaleString(
                                "es-AR",
                              ) ?? 0}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
