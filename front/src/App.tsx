import "./App.css";
import { Home } from "./pages/Home.jsx";
import DeshboardLayout from "./layouts/DashboardLayout.jsx";
import { Barberos } from "./pages/Barberos.jsx";
import { Route, Routes } from "react-router";
import { Prueba } from "./pages/Prueba.jsx";

import { TablaCortes } from "./features/TablaCortes.js";

function App() {
  return (
    <>
      <Routes>
        <Route element={<DeshboardLayout></DeshboardLayout>}>
          <Route index element={<Home></Home>}></Route>
          <Route path="/prueba" element={<Barberos></Barberos>}></Route>
          <Route
            path="/editar"
            element={
              <TablaCortes
                url={"http://localhost:3000/api/corte"}
              ></TablaCortes>
            }
          ></Route>
        </Route>
        <Route path="/marica" element={<Prueba></Prueba>}></Route>
      </Routes>
    </>
  );
}

export default App;
