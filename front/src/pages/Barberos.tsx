import { useEffect, useState } from "react";
import { FormularioEditarBarbero } from "../features/FormularioEditarBarbero";
import { FormularioRegistrarBarbero } from "../features/FormularioRegistrarBarbero";

export interface Barbero {
  id: number;
  nombre: string;
  activo: boolean;
  comision: number;
}

export function Barberos() {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<Barbero>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [modalRegistrarBarbero, setModalRegistraBarbero] =
    useState<boolean>(false);
  const [modalEditarBarbero, setModalEditarBarbero] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/barberos/barberosTotales")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los barberos");
        return res.json();
      })
      .then((data: Barbero[]) => {
        setBarberos(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const editarBarbero = (id: number) => {
    const barberoAEditar = barberos.find((c) => c.id === id);
    if (barberoAEditar) {
      setBarberoSeleccionado(barberoAEditar);
      setModalEditarBarbero(true);
    }
  };

  function borrarBarbero(id: number) {
    fetch("http://localhost:3000/api/barberos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err))
      .finally(() => {
        actualizarDatos(true);
      });
  }

  const actualizarDatos = (seActualizo: boolean) => {
    if (seActualizo === true) {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <main className="w-full bg-slate-100 min-h-screen p-4 md:p-6 text-slate-800">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Encabezado y Botón de Registro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Gestión de Barberos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Control de equipo, estados y comisiones del personal
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalRegistraBarbero(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          >
            <span className="text-sm font-bold leading-none">+</span> Registrar
            Barbero
          </button>
        </div>

        {/* Contenedor de la lista en Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800"></span>
                <span>Cargando barberos...</span>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full py-12 text-center text-red-500 text-xs font-semibold bg-white rounded-xl border border-slate-200">
              {error}
            </div>
          ) : barberos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
              No hay barberos registrados
            </div>
          ) : (
            barberos.map((barbero) => (
              <div
                key={barbero.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-2xs">
                        {barbero.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          {barbero.nombre}
                        </h2>
                        <span className="text-[11px] text-slate-400">
                          ID: #{barbero.id}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                        barbero.activo
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : "bg-rose-50 text-rose-700 ring-rose-600/20"
                      }`}
                    >
                      {barbero.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Comisión
                      </span>
                      <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                        {barbero.comision}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      editarBarbero(barbero.id);
                    }}
                    className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors text-center"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      borrarBarbero(barbero.id);
                    }}
                    className="flex-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors text-center"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modales */}
        {modalRegistrarBarbero && (
          <FormularioRegistrarBarbero
            cerrarModal={() => {
              setModalRegistraBarbero(false);
              actualizarDatos(true);
            }}
          />
        )}

        {modalEditarBarbero && barberoSeleccionado && (
          <FormularioEditarBarbero
            barbero={barberoSeleccionado}
            cerrarModal={() => {
              setModalEditarBarbero(false);
              actualizarDatos(true);
            }}
          />
        )}
      </div>
    </main>
  );
}
