import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Container from "../components/common/Container";
import Footer from "../components/common/Footer";
import "../styles/AdminLayout.css"

const menuPackages = [
    {
      name: "Gestión Usuarios",
      items: [
        { label: "Gestionar Usuario", path: "gestionar-usuario", icon: "-" },
      ]
    },
  ];

export default function AdminLayout() {
  return (
    <div className="AdminLayout-container">
      <Header title="Smart Condominium" userName="Juan" />
      <Sidebar menuPackages={menuPackages} />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}