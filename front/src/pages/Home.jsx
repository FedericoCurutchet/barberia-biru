import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { TablaCortes } from "../features/TablaCortes";

export function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mes, setMes] = useState(() => new Date().getMonth());
  const [dia, setDia] = useState("hoy");
  const [barberoExpandido, setBarberoExpandido] = useState(null);

  const [urlCortes, setUrlCortes] = useState(
    "http://localhost:3000/api/corte/cortesDia",
  );
  const [urlResumen, setUrlResumen] = useState(
    "http://localhost:3000/api/corte/resumenTotalDia",
  );
  const [urlBarberos, setUrlBarberos] = useState(
    "http://localhost:3000/api/corte/resumenBarberosDia",
  );

  const cambiarUrlSelector = (diaSelect) => {
    if (diaSelect === "hoy") {
      setUrlCortes("http://localhost:3000/api/corte/cortesDia");
      setUrlResumen("http://localhost:3000/api/corte/resumenTotalDia");
      setUrlBarberos("http://localhost:3000/api/corte/resumenBarberosDia");
    } else if (diaSelect === "semana") {
      setUrlCortes("http://localhost:3000/api/corte/cortesSemana");
      setUrlResumen("http://localhost:3000/api/corte/resumenTotalSemana");
      setUrlBarberos("http://localhost:3000/api/corte/resumenBarberosSemana");
    } else if (diaSelect === "mes") {
      setUrlCortes(`http://localhost:3000/api/corte/cortesDelMes?mes=${mes}`);
      setUrlResumen(
        `http://localhost:3000/api/corte/resumenTotalMes?mes=${mes}`,
      );
      setUrlBarberos(
        `http://localhost:3000/api/corte/resumenBarberosMes?mes=${mes}`,
      );
    }
  };

  useEffect(() => {
    cambiarUrlSelector(dia);
  }, [mes, dia]);

  // @ts-ignore
  const resumen = useFetch(urlResumen, refreshTrigger);
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
              Inicio & Operaciones
            </h1>
            <p className="text-xs text-slate-500">
              Monitoreo en tiempo real de cortes y actividad de la barbería
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {dia === "mes" && (
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
            )}

            <select
              name="dia"
              id="dia"
              value={dia}
              onChange={(e) => {
                const nuevoDia = e.target.value;
                setDia(nuevoDia);
              }}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              <option value="hoy">Vista: Hoy</option>
              <option value="semana">Vista: Esta Semana</option>
            </select>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ingresos Totales
              </p>
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Facturado
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              $
              {new Intl.NumberFormat("de-DE").format(resumen?._sum?.monto ?? 0)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Total bruto recaudado
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Monto Barbería
              </p>
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Local
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              $
              {new Intl.NumberFormat("de-DE").format(
                resumen?._sum?.montoBarberia ?? 0,
              )}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Ganancia neta del negocio
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Comisiones Barberos
              </p>
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                Equipo
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              $
              {new Intl.NumberFormat("de-DE").format(
                resumen?._sum?.comisionBarbero ?? 0,
              )}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Total pagado a colaboradores
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_350px]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="border-b border-slate-100 px-4 py-3 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Listado de Cortes
                </h2>
                <p className="text-[11px] text-slate-500">
                  Transacciones registradas en el período seleccionado
                </p>
              </div>
            </div>
            <TablaCortes url={urlCortes} onSeActualizo={actualizarDatos} />
          </section>

          <section className="h-fit rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden sticky top-5">
            <div className="border-b border-slate-100 px-4 py-3 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800">
                Rendimiento por Barbero
              </h2>
              <p className="text-[11px] text-slate-500">
                Haz clic en un barbero para expandir los detalles
              </p>
            </div>

            <div className="divide-y divide-slate-100 max-h-[calc(100vh-220px)] overflow-y-auto">
              {Array.isArray(barberos) && barberos.length > 0 ? (
                barberos.map((barbero, index) => {
                  const estaAbierto = barberoExpandido === barbero.nombre;
                  return (
                    <div
                      key={barbero.nombre}
                      className="transition-colors hover:bg-slate-50/70"
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
                          <span className="text-[11px] font-bold text-slate-400 w-4 text-center">
                            #{index + 1}
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

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">
                              $
                              {barbero.comisionBarbero?.toLocaleString(
                                "es-AR",
                              ) ?? 0}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Comisión
                            </p>
                          </div>
                          <span
                            className={`transform transition-transform duration-200 text-slate-400 text-[10px] ml-1 ${estaAbierto ? "rotate-180" : ""}`}
                          >
                            ▼
                          </span>
                        </div>
                      </button>

                      {estaAbierto && (
                        <div className="px-3.5 pb-3.5 pt-1 bg-slate-50/80 border-t border-slate-100/60 grid grid-cols-2 gap-2">
                          <div className="rounded-md border border-slate-200/80 bg-white p-2.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Cortes
                            </span>
                            <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">
                              {barbero.cantidadCortes ?? 0}
                            </span>
                          </div>
                          <div className="rounded-md border border-slate-200/80 bg-white p-2.5 shadow-2xs">
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                              Monto Generado
                            </span>
                            <span className="text-sm font-extrabold text-indigo-600 mt-0.5 block">
                              ${barbero.monto?.toLocaleString("es-AR") ?? 0}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No hay datos registrados para este período.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
