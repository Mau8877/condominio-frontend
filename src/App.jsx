import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./home/HomePage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import GestionarUsuario from "./pages/GestionarUsuario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas con AdminLayout */}
        <Route path="/adminlayout" element={<AdminLayout />}>
          {/* Ruta por defecto dentro del layout */}
          <Route index element={<AdminDashboard />} />
          {/* Rutas hijas */}
          <Route path="gestionar-usuario" element={<GestionarUsuario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
