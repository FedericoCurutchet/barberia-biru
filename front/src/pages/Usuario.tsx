import { useEffect, useState } from "react";
import type { Usuario as UsuarioType } from "../types/Usuario";
import { FormularioRegistrarUsuario } from "../features/FormularioRegistrarUsuario";
import { FormularioEditarUsuario } from "../features/FormularioEditarUsuario";
import { ModalAdminPermiso } from "../features/ModalAdminPermiso";
import type { Registro } from "../types/registro";

export function Usuario() {
  const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recargar, setRecargar] = useState(0);
  const [modalRegistrar, setModalRegistrar] = useState<boolean>(false);
  const [modalEditar, setModialEditar] = useState<boolean>(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioType>();
  const [modalPermisoAdmin, setModalPermisoAdmin] = useState<boolean>(false);

  const [mostrarRegistros, setMostrarRegistros] = useState<boolean>(false);
  const [usuarioElminar, setUsuarioEliminar] = useState(0);

  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:3000/api/usuarios", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((dataResponse: UsuarioType[]) => {
        if (Array.isArray(dataResponse)) {
          setUsuarios(dataResponse);
        }
      })
      .catch((err) => setError(err.message || "Error al cargar los usuarios"))
      .finally(() => setLoading(false));

    fetch("http://localhost:3000/api/registros", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((dataResponse: Registro[]) => {
        if (Array.isArray(dataResponse)) {
          setRegistros(dataResponse);
        }
      })
      .catch((err) => console.error("Error al cargar los registros:", err));
  }, [recargar]);

  const borrarUsuario = async (contrasenaAdmin: string) => {
    const respuesta = await fetch("http://localhost:3000/api/usuarios", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        id: usuarioElminar,
        contrasena_admin: contrasenaAdmin,
      }),
    });
    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(
        errorData.error || "Contraseña de administrador inválida",
      );
    }
    actualizarDatos(true);
  };

  const editarUsuario = (id: number) => {
    const usuarioAEditar = usuarios.find((c) => c.id === id);
    if (usuarioAEditar) {
      setUsuarioSeleccionado(usuarioAEditar);
      setModialEditar(true);
    }
  };

  const actualizarDatos = (seActualizo: boolean) => {
    if (seActualizo === true) {
      setRecargar((prev) => prev + 1);
    }
  };

  return (
    <main className="w-full bg-slate-100 min-h-screen p-4 md:p-6 text-slate-800">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Gestión de Usuarios
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Control de cuentas, accesos y roles del sistema
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalRegistrar(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          >
            <span className="text-sm font-bold leading-none">+</span> Registrar
            Usuario
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800"></span>
                <span>Cargando usuarios...</span>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full py-12 text-center text-rose-500 text-xs font-semibold bg-white rounded-xl border border-slate-200">
              {error}
            </div>
          ) : usuarios.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
              No hay usuarios registrados.
            </div>
          ) : (
            usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-2xs">
                        {usuario.nombre
                          ? usuario.nombre.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          {usuario.nombre}
                        </h2>
                        <span className="text-[11px] text-slate-400">
                          @{usuario.nombreUsuario}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-500/10">
                      {usuario.rol}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      editarUsuario(usuario.id);
                    }}
                    className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors text-center"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioEliminar(usuario.id);
                      setModalPermisoAdmin(true);
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

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setMostrarRegistros(!mostrarRegistros)}
            className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50/60 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                📋
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Historial de Registros del Sistema
                </h2>
                <p className="text-[11px] text-slate-400">
                  Visualiza las últimas acciones realizadas por los
                  administradores
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {mostrarRegistros ? "Ocultar" : "Ver registros"}
              </span>
              <svg
                className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                  mostrarRegistros ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {mostrarRegistros && (
            <div className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-2.5">
              {registros.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No hay registros recientes.
                </div>
              ) : (
                registros.map((reg, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <p className="text-xs text-slate-700 font-medium">
                      {reg.registro}
                    </p>
                    <span className="inline-flex shrink-0 items-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 w-fit">
                      {new Date(reg.hora).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modales */}
        {modalRegistrar && (
          <FormularioRegistrarUsuario
            cerrarModal={() => {
              setModalRegistrar(false);
              actualizarDatos(true);
            }}
          />
        )}

        {modalEditar && usuarioSeleccionado && (
          <FormularioEditarUsuario
            usuario={usuarioSeleccionado}
            cerrarModal={() => {
              setModialEditar(false);
              actualizarDatos(true);
            }}
          />
        )}

        <ModalAdminPermiso
          isOpen={modalPermisoAdmin}
          onClose={() => setModalPermisoAdmin(false)}
          onConfirmar={borrarUsuario}
          titulo="Eliminar Usuario"
          descripcion="Introduce la contraseña de administrador para autorizar la baja de este usuario."
        />
      </div>
    </main>
  );
}
