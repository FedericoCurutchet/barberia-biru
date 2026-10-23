import "./App.css";
import { Home } from "./pages/Home.jsx";
import DeshboardLayout from "./layouts/DashboardLayout.jsx";
import { Barberos } from "./pages/Barberos.jsx";
import { Route, Routes } from "react-router";
import { Prueba } from "./pages/Prueba.jsx";

import { TablaCortes } from "./features/TablaCortes.js";
import { Resumen } from "./pages/Resumen.jsx";
import { Usuario } from "./pages/Usuario.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route element={<DeshboardLayout></DeshboardLayout>}>
          <Route index element={<Home></Home>}></Route>
          <Route path="/barberos" element={<Barberos></Barberos>}></Route>
          <Route
            path="/editar"
            element={
              <TablaCortes
                url={"http://localhost:3000/api/corte"}
              ></TablaCortes>
            }
          ></Route>
          <Route path="/resumen" element={<Resumen></Resumen>}></Route>
          <Route path="/configuracion" element={<Barberos></Barberos>}></Route>
          <Route path="/usuario" element={<Usuario></Usuario>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
