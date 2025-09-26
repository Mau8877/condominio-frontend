import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import DataGrid from "../components/DataGrid";
import AdvancedPagination from "../components/AdvancedPagination";
import { getCalles, deleteCalle } from "../services/calleService";
import { useDebounce } from "../hooks/useDebounce";
import { Signpost } from "lucide-react";

const calleColumnsGrid = [
  { key: "id", label: "ID", sortable: true, width: "80px" },
  { key: "nombre", label: "Nombre", sortable: true },
  { key: "estado", label: "Estado", sortable: true },
];

const calleColumnsCard = [
  { key: "id", label: "ID", icon: "IdCard" },
  { key: "nombre", label: "Nombre", icon: "Signpost" },
];

const calleColumnsCardExtended = [
  { key: "estado", label: "Estado", icon: "Shield" },
];

const calleFields = [
  {
    key: "nombre",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre de la calle",
  },
];

const GestionarCalles = () => {
  // Estado principal de la UI
  const [loading, setLoading] = useState(true);
  const [calle, setCalle] = useState([]);
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
  const fetchCalle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir el objeto de ordenamiento para la API
      const apiOrdering = ordering.startsWith("-")
        ? `-${ordering.substring(1)}`
        : ordering;

      const data = await getCalles({
        page,
        pageSize,
        search: debouncedSearch,
        ordering: apiOrdering,
      });

      setCalle(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, ordering]); // Dependencias

  useEffect(() => {
    fetchCalle();
  }, [fetchCalle]); // El efecto se dispara cuando cambia la función fetchCalle

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
    navigate("/adminlayout/crear-calle");
  };

  const handleEdit = (calle) => {
    navigate(`/adminlayout/editar-calle/${calle.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta calle?")) {
      try {
        await deleteCalle(id);
        alert("Calle eliminado exitosamente");
        fetchCalle();
      } catch (error) {
        alert("Error al eliminar Calle: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "0 var(--spacing-xl)" }}>
      <PageHeader
        title="Gestión de Calles"
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
          data={calle}
          columns={calleColumnsGrid}
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
          {calle.map((calle) => (
            <Card
              key={calle.id}
              data={calle}
              columns={calleColumnsCard}
              extendedColumns={calleColumnsCardExtended}
              icon={Signpost}
              titleField="nombre"
              subtitleField="id"
              onEdit={() => handleEdit(calle)}
              onDelete={() => handleDelete(calle.id)}
            />
          ))}
        </div>
      )}
      {!loading && pagination && calle.length > 0 && (
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

export default GestionarCalles;
