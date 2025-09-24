import React from "react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataGrid from "../components/DataGrid";
import Breadcrumb from "../components/Breadcrumb";

const userColumns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    width: "80px",
  },
  {
    key: "name",
    label: "Nombre",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "address.city", // Key anidada
    label: "Ciudad",
    sortable: true,
  },
  {
    key: "company.name", // Key anidada
    label: "Compañía",
    sortable: false, // Esta columna no se puede ordenar
  },
];

const GestionarUsuario = () => {
  const API_URL = "https://jsonplaceholder.typicode.com/users";

  // Estado para la vista actual
  const [view, setView] = useState("grid");

  // Estado para los breadcrumbs
  const baseBreadcrumbs = [{ label: "Usuarios" }];
  const [breadcrumbs, setBreadcrumbs] = useState(baseBreadcrumbs);

  const handleAddNew = () => {
    setBreadcrumbs([...baseBreadcrumbs, { label: "Añadir Nuevo" }]);
    alert("Acción: Añadir nuevo usuario");
  };

  const handleEdit = (user) => {
    setBreadcrumbs([...baseBreadcrumbs, { label: `Editar: ${user.name}` }]);
    alert(`Acción: Editar usuario con ID ${user.id}`);
  };

  const handleDelete = (userId) => {
    if (
      window.confirm(
        `¿Seguro que quieres eliminar al usuario con ID ${userId}?`
      )
    ) {
      alert(`Acción: Eliminar usuario con ID ${userId}`);
    }
  };

  const handleReport = () => {
    setBreadcrumbs([...baseBreadcrumbs, { label: "Generar Reporte" }]);
    alert("Acción: Generar reporte");
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setBreadcrumbs(baseBreadcrumbs); // Reset breadcrumbs al cambiar de vista
  };

  return (
    <div style={{ padding: "0" }}>
      <Breadcrumb items={breadcrumbs} />
      <div style={{ padding: "0 var(--spacing-xl)" }}>
        <PageHeader
          title="Gestión de Usuarios"
          onAdd={handleAddNew}
          onReport={handleReport}
          currentView={view}
          onViewChange={handleViewChange}
        />
        {view === "grid" ? (
          <DataGrid
            apiUrl={API_URL}
            columns={userColumns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          // Aquí iría el componente de vista de tarjetas cuando se implemente
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              backgroundColor: "var(--color-background-primary)",
              borderRadius: "var(--border-radius-lg)",
            }}
          >
            <h2>Vista de Tarjetas (Próximamente)</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionarUsuario;
