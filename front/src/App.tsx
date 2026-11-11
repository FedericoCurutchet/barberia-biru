import "./App.css";
import { Route, Routes } from "react-router";
import { Home } from "./pages/Home.jsx";
import DeshboardLayout from "./layouts/DashboardLayout.jsx";
import { Barberos } from "./pages/Barberos.jsx";
import { Resumen } from "./pages/Resumen.jsx";
import { Usuario } from "./pages/Usuario.jsx";
import { Login } from "./pages/Login.js";
import { ProtectedRoute } from "./router/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<DeshboardLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}>
            <Route path="/usuario" element={<Usuario />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMINISTRADOR", "NORMAL"]} />
            }
          >
            <Route path="/barberos" element={<Barberos />} />
            <Route path="/resumen" element={<Resumen />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["ADMINISTRADOR", "NORMAL", "SOLO_REGISTRO"]}
              />
            }
          >
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
