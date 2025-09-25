// src/pages/GestionarUsuario.js
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import DataGrid from "../components/DataGrid";
import AdvancedPagination from "../components/AdvancedPagination";
import { getUsers, deleteUser } from "../services/userService";
import { useDebounce } from "../hooks/useDebounce";
import { User, Shield, BadgeInfo } from "lucide-react";

const userColumnsGrid = [
  { key: "ci", label: "CI", sortable: true, width: "80px" },
  { key: "first_name", label: "Nombres", sortable: true },
  { key: "last_name", label: "Apellidos", sortable: true },
  { key: "correo", label: "Correo", sortable: true },
  { key: "tipo", label: "Tipo", sortable: true },
  { key: "estado", label: "Estado", sortable: true },
];

const userColumnsCard = [
  { key: "ci", label: "CI", icon: "IdCard" },
  { key: "first_name", label: "Nombres", icon: "User" },
  { key: "last_name", label: "Apellidos", icon: "User" },
  { key: "tipo", label: "Tipo", icon: "BadgeInfo" },
  { key: "estado", label: "Estado", icon: "Shield" },
];

const userColumnsCardExtended = [
  { key: "correo", label: "Correo", icon: "Mail" },
  { key: "fecha_nacimiento", label: "Fecha de Nacimiento", icon: "Calendar" },
  { key: "telefono", label: "Teléfono", icon: "Phone" },
  { key: "sexo", label: "Sexo", icon: "User" },
];

const userFields = [
  {
    key: "ci",
    label: "Cédula de Identidad",
    type: "text",
    required: true
  },
  {
    key: "first_name",
    label: "Nombres",
    type: "text",
    required: true,
    placeholder: "Ingrese los nombres"
  },
  {
    key: "last_name", 
    label: "Apellidos",
    type: "text",
    required: true
  },
  {
    key: "password",
    label: "Contraseña",
    type: "password",
    required: true,
    placeholder: "Ingrese una contraseña segura"
  },
  {
    key: "correo",
    label: "Email",
    type: "email",
    required: true
  },
  {
    key: "fecha_nacimiento",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true
  },
  {
    key: "telefono",
    label: "Teléfono",
    type: "text",
    required: true,
    placeholder: "Ingrese el teléfono"
  },
  {
    key: "sexo",
    label: "Sexo",
    type: "select",
    required: true,
    options: [
      { value: "M", label: "Masculino" },
      { value: "F", label: "Femenino" }
    ]
  },
  {
    key: "tipo",
    label: "Tipo de Usuario",
    type: "select",
    required: true,
    options: [
      { value: "Administrador", label: "Administrador" },
      { value: "Copropietario", label: "Copropietario" },
      { value: "Residente", label: "Residente" },
      { value: "Guardia", label: "Guardia" },
      { value: "Trabajador", label: "Trabajador" }
    ]
  }
];

const getUserIcon = (userType) => {
  const iconMap = {
    Administrador: Shield,
    Copropietario: User,
    Residente: User,
    Trabajador: BadgeInfo,
    Guardia: Shield,
  };
  return iconMap[userType] || User;
};

const GestionarUsuario = () => {
  // Estado principal de la UI
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [pagination, setPagination] = useState(null);

  const navigate = useNavigate();

  // Hook para sincronizar el estado con los parámetros de la URL
  const [searchParams, setSearchParams] = useSearchParams();

  // --- EXTRACCIÓN DE PARÁMETROS DE LA URL ---
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "20", 10);
  const search = searchParams.get("search") || "";
  const ordering = searchParams.get("ordering") || "id"; // Orden por defecto

  // Estado local para el input de búsqueda (para debouncing)
  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearch = useDebounce(searchTerm, 300); // 300ms debounce

  // --- EFECTO PRINCIPAL PARA CARGAR DATOS ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir el objeto de ordenamiento para la API
      const apiOrdering = ordering.startsWith("-")
        ? `-${ordering.substring(1)}`
        : ordering;

      const data = await getUsers({
        page,
        pageSize,
        search: debouncedSearch,
        ordering: apiOrdering,
      });

      setUsers(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, ordering]); // Dependencias

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // El efecto se dispara cuando cambia la función fetchUsers

  // Actualizar la URL cuando cambia el término de búsqueda con debounce
  useEffect(() => {
    updateURL("search", debouncedSearch, true);
  }, [debouncedSearch]);

  // --- HANDLERS QUE ACTUALIZAN LA URL ---
  const updateURL = (key, value, replace = false) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set(key, value);
        } else {
          prev.delete(key);
        }
        // Si estamos buscando, siempre volvemos a la página 1
        if (replace) {
          prev.set("page", "1");
        }
        return prev;
      },
      { replace: true }
    );
  };

  const handleSort = (key) => {
    const newOrdering = ordering === key ? `-${key}` : key;
    updateURL("ordering", newOrdering);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    updateURL("page", newPage);
  };

  const handleAdd = () => {
    navigate("/adminlayout/crear");
  };

  const handleEdit = (user) => {
    navigate(`/adminlayout/editar/${user.id}`);
  };

  const handleDelete = async (id) => {
  if (window.confirm("¿Está seguro de eliminar este usuario?")) {
    try {
      await deleteUser(id); 
      alert("Usuario eliminado exitosamente");
      fetchUsers(); 
    } catch (error) {
      alert("Error al eliminar usuario: " + error.message);
    }
  }
}

  return (
    <div style={{ padding: "0 var(--spacing-xl)" }}>
      <PageHeader
        title="Gestión de Usuarios"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentView={view}
        onViewChange={setView}
        onAdd={handleAdd}
        onReport={() => alert("Reporte...")}
      />
      {/* CONDICIONAL PARA DIFERENTES VISTAS */}
      {view === "grid" ? (
        <DataGrid
          loading={loading}
          error={error}
          data={users}
          columns={userColumnsGrid}
          sortConfig={{
            key: ordering.replace("-", ""),
            direction: ordering.startsWith("-") ? "descending" : "ascending",
          }}
          onSort={handleSort}
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--spacing-lg)",
          }}
        >
          {users.map((user) => (
            <Card
              key={user.id}
              data={user}
              columns={userColumnsCard}
              extendedColumns={userColumnsCardExtended}
              icon={getUserIcon(user.tipo)}
              titleField="first_name"
              subtitleField="last_name"
              onEdit={() => handleEdit(user)}
              onDelete={() => handleDelete(user.id)}
            />
          ))}
        </div>
      )}
      {!loading && pagination && users.length > 0 && (
        <AdvancedPagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          totalItems={pagination.total_items}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default GestionarUsuario;
