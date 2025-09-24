import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import DataGrid from "../components/DataGrid";
import AdvancedPagination from "../components/AdvancedPagination";
import { mockUsers } from "../../mockData";
import { getNestedValue, sortData } from "../utils/dataUtils";

const userColumns = [
  { key: "id", label: "ID", sortable: true, width: "80px" },
  { key: "name", label: "Nombre", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "address.city", label: "Ciudad", sortable: true },
  { key: "company.name", label: "Compañía", sortable: true },
];

const GestionarUsuario = () => {
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [view, setView] = useState("grid");
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Usuarios", link: "/users" },
    { label: "Listado" },
  ]);

  // --- EFECTOS ---
  useEffect(() => {
    // Simula la carga de datos desde una API
    setLoading(true);
    setTimeout(() => {
      setAllData(mockUsers);
      setLoading(false);
    }, 1000); // 1 segundo de delay
  }, []);

  // --- DATOS MEMOIZADOS (PARA RENDIMIENTO) ---
  const filteredData = useMemo(() => {
    if (!searchTerm) return allData;
    return allData.filter(
      (user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        String(user.address.city)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(user.company.name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [allData, searchTerm]);

  const sortedData = useMemo(() => {
    return sortData(filteredData, sortConfig);
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // --- HANDLERS ---
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: "0 var(--spacing-xl)" }}>
      <PageHeader
        title="Gestión de Usuarios"
        breadcrumbs={breadcrumbs}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentView={view}
        onViewChange={setView}
        onAdd={() => alert("Añadir...")}
        onReport={() => alert("Reporte...")}
      />
      <DataGrid
        loading={loading}
        error={error}
        data={paginatedData}
        columns={userColumns}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={(user) => alert(`Editando ${user.name}`)}
        onDelete={(id) => alert(`Eliminando ID ${id}`)}
      />
      {!loading && sortedData.length > 0 && (
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default GestionarUsuario;
