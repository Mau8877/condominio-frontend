import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import PageHeader from "../components/PageHeader";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Gestiona los usuarios de la plataforma"
        breadcrumb={[
          { label: "Dashboard", icon: "home" },
          { label: "Usuarios", icon: "users" },
        ]}
        showRoot={false} // 👈 ya no sale el Dashboard
        actions={[
          { label: "Crear", icon: "plus", onClick: () => console.log("crear") },
          {
            label: "Editar",
            icon: "edit",
            onClick: () => console.log("editar"),
          },
          {
            label: "Exportar",
            icon: "export",
            onClick: () => console.log("exportar"),
          },
        ]}
        showViewToggle={true}
        currentView="table"
        onViewChange={(view) => console.log("vista:", view)}
      />
    </div>
  );
}
