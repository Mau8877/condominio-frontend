import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Container from "../components/common/Container";
import Footer from "../components/common/Footer";
import "../styles/AdminLayout.css";
import { UserRound, BookUser, DogIcon } from "lucide-react";
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
        label: "Gestionar Residente",
        path: "gestionar-residente",
        icon: <UserRound />,
      },
      {
        label: "Gestionar Copropietario",
        path: "gestionar-copropietario",
        icon: <UserRound />,
      },
      {
        label: "Gestionar Familia",
        path: "gestionar-familia",
        icon: <BookUser />,
      },
      {
        label: "Gestionar Mascota",
        path: "gestionar-mascota",
        icon: <DogIcon />,
      },
    ],
  },
];

export default function AdminLayout() {
  return (
    <div className="AdminLayout-container">
      <Header
        logo={logo}
        title="Smart Condominium"
        userName="Juan"
        navigation="/adminlayout"
      />
      <Sidebar menuPackages={menuPackages} />
      <Container>
        <Outlet />
      </Container>
   
    </div>
  );
}
