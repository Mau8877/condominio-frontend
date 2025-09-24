import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./home/HomePage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import GestionarUsuario from "./pages/GestionarUsuario";
import GestionarFamilia from "./pages/GestionarFamilia";
import GestionarMascota from "./pages/GestionarMascota";
import GestionarVehiculo from "./pages/GestionarVehiculo";
import GestionarHistorialVisitas from "./pages/GestionarHistorialVisitas";
import GestionarListaInvitados from "./pages/GestionarListaInvitados";
import RegistrarVisitante from "./pages/RegistrarVisitante";
import ReportarInfraccion from "./pages/ReportarInfraccion";
import GenerarTarea from "./pages/GenerarTarea";
import ChecklistTareas from "./pages/ChecklistTareas";
import GenerarAviso from "./pages/GenerarAviso";
import GestionarCalles from "./pages/GestionarCalles";
import GestionarCasas from "./pages/GestionarCasas";
import GestionarInfraestructura from "./pages/GestionarInfraestructura";
import RealizarReserva from "./pages/RealizarReserva";
import RealizarPago from "./pages/RealizarPago";
import GestionarPagos from "./pages/GestionarPagos";
import GenerarMulta from "./pages/GenerarMulta";
import GenerarExpensa from "./pages/GenerarExpensa";
import MonitorearMorosidad from "./pages/MonitorearMorosidad";
import GestionarContratos from "./pages/GestionarContratos";
import GestionarBitacora from "./pages/GestionarBitacora";

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
          {/* Rutas hijas - Gestión Usuarios */}
          <Route path="gestionar-usuario" element={<GestionarUsuario />} />
          <Route path="gestionar-familia" element={<GestionarFamilia />} />
          <Route path="gestionar-mascota" element={<GestionarMascota />} />
          <Route path="gestionar-vehiculo" element={<GestionarVehiculo />} />

          {/* Rutas hijas - Seguridad y Control de Acceso */}
          <Route
            path="gestionar-historial-visitas"
            element={<GestionarHistorialVisitas />}
          />
          <Route
            path="gestionar-lista-invitados"
            element={<GestionarListaInvitados />}
          />
          <Route path="registrar-visitante" element={<RegistrarVisitante />} />
          <Route path="reportar-infraccion" element={<ReportarInfraccion />} />

          {/* Rutas hijas - Tareas y Comunicación */}
          <Route path="generar-tarea" element={<GenerarTarea />} />
          <Route path="checklist-tareas" element={<ChecklistTareas />} />
          <Route path="generar-aviso" element={<GenerarAviso />} />

          {/* Rutas hijas - Viviendas e Infrastructura */}
          <Route path="gestionar-calles" element={<GestionarCalles />} />
          <Route path="gestionar-casas" element={<GestionarCasas />} />
          <Route
            path="gestionar-infraestructura"
            element={<GestionarInfraestructura />}
          />
          <Route path="realizar-reserva" element={<RealizarReserva />} />

          {/* Rutas hijas - Finanzas y Administración */}
          <Route path="realizar-pago" element={<RealizarPago />} />
          <Route path="gestionar-pagos" element={<GestionarPagos />} />
          <Route path="generar-multa" element={<GenerarMulta />} />
          <Route path="generar-expensa" element={<GenerarExpensa />} />
          <Route
            path="monitorear-morosidad"
            element={<MonitorearMorosidad />}
          />
          <Route path="gestionar-contratos" element={<GestionarContratos />} />
          <Route path="gestionar-bitacora" element={<GestionarBitacora />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
