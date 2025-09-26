import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Container from "../components/common/Container";
import Footer from "../components/common/Footer";
import "../styles/AdminLayout.css";
import {
  UserRound,
  BookUser,
  DogIcon,
  CarFront,
  UsersRound,
  UserRoundPlus,
  ClipboardList,
  OctagonAlert,
  NotebookPen,
  ListChecks,
  ShieldAlert,
  House,
  Signpost,
  Warehouse,
  CalendarClock,
  Dumbbell,
  WavesLadder,
  Landmark,
  LucideSiren,
  Receipt,
  CalendarOff,
  FileSignature,
  BookOpen,
  CreditCard,
} from "lucide-react";

import logo from "../assets/logo.png";

const menuPackages = [
  {
    name: "Gestión Usuarios",
    items: [
      {
        label: "Gestionar Usuario",
        path: "gestionar-usuario",
        icon: <UserRound />,
      },
      {
        label: "Gestionar Familia",
        path: "gestionar-familia",
        icon: <UsersRound />,
      },
      {
        label: "Gestionar Mascota",
        path: "gestionar-mascota",
        icon: <DogIcon />,
      },
      {
        label: "Gestionar Vehículo",
        path: "gestionar-vehiculo",
        icon: <CarFront />,
      },
    ],
  },
  {
    name: "Seguridad y Control de Acceso",
    items: [
      {
        label: "Gestionar Historial de Visitas",
        path: "gestionar-historial-visitas",
        icon: <BookUser />,
      },
      {
        label: "Gestionar Lista de Invitados",
        path: "gestionar-lista-invitados",
        icon: <ClipboardList />,
      },
      {
        label: "Registrar Visitante",
        path: "registrar-visitante",
        icon: <UserRoundPlus />,
      },
      {
        label: "Reportar Infraccion",
        path: "reportar-infraccion",
        icon: <OctagonAlert />,
      },
    ],
  },
  {
    name: "Tareas y Comunicación",
    items: [
      {
        label: "Generar Tarea",
        path: "generar-tarea",
        icon: <NotebookPen />,
      },
      {
        label: "Checklist de Tareas",
        path: "checklist-tareas",
        icon: <ListChecks />,
      },
      {
        label: "Generar Aviso",
        path: "generar-aviso",
        icon: <ShieldAlert />,
      },
    ],
  },
  {
    name: "Viviendas e Infrastructura",
    items: [
      {
        label: "Gestionar Calles",
        path: "gestionar-calles",
        icon: <Signpost />,
      },
      {
        label: "Gestionar Casas",
        path: "gestionar-casas",
        icon: <House />,
      },
      {
        label: "Gestionar Infraestructura",
        path: "gestionar-infraestructura",
        icon: <WavesLadder />,
      },
      {
        label: "Realizar Reserva",
        path: "realizar-reserva",
        icon: <CalendarClock />,
      },
    ],
  },
  {
    name: "Finanzas y Administración",
    items: [
      {
        label: "Realizar Pago",
        path: "realizar-pago",
        icon: <CreditCard />,
      },
      {
        label: "Gestionar Pagos",
        path: "gestionar-pagos",
        icon: <Landmark />,
      },
      {
        label: "Generar Multa",
        path: "generar-multa",
        icon: <LucideSiren />,
      },
      {
        label: "Generar Expensa",
        path: "generar-expensa",
        icon: <Receipt />,
      },
      {
        label: "Monitorear Morosidad",
        path: "monitorear-morosidad",
        icon: <CalendarOff />,
      },
      {
        label: "Gestionar Contratos",
        path: "gestionar-contratos",
        icon: <FileSignature />,
      },
      {
        label: "Gestionar Bitácora",
        path: "gestionar-bitacora",
        icon: <BookOpen />,
      },
    ],
  },
];

export default function AdminLayout() {
  const usuario = JSON.parse(localStorage.getItem("user"));
  const nombre = usuario.fist_name;
  const rol = usuario.tipo;
  return (
    <div className="AdminLayout-container">
      <Header
        logo={logo}
        title="Smart Condominium"
        userName={nombre}
        rol={rol}
        navigation="/adminlayout"
      />
      <Sidebar menuPackages={menuPackages} />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}
