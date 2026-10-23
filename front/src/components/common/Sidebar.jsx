import { Link, NavLink } from "react-router";

export function Sidebar() {
  const opciones = [
    { nombre: "Inicio", icono: "⌂", ruta: "/" },
    { nombre: "Usuario", icono: "👤", ruta: "/usuario" },
    { nombre: "Barberos", icono: "✂", ruta: "/barberos" },
    { nombre: "Resumen", icono: "📊", ruta: "/resumen" },
    { nombre: "Configuración", icono: "⚙", ruta: "/configuracion" },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-4 shadow-sm">
      {/* Título */}
      <div className="mb-8 px-3">
        <h2 className="text-2xl font-bold text-gray-800">Barbería</h2>

        <p className="text-sm text-gray-500">Panel de administración</p>
      </div>

      {/* Navegación */}
      <nav>
        <ul className="flex flex-col gap-2">
          {opciones.map((opcion) => (
            <li key={opcion.nombre}>
              <NavLink
                to={opcion.ruta}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gray-200 text-black"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                      {opcion.icono}
                    </span>

                    <span className="font-medium">{opcion.nombre}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Parte inferior */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <span>↪</span>

          <span className="font-medium">Cerrar sesión</span>
        </a>
      </div>
    </aside>
  );
}
