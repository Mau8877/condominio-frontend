import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import DataGrid from "../components/DataGrid";
import AdvancedPagination from "../components/AdvancedPagination";
import { useDebounce } from "../hooks/useDebounce";
import { getBitacora } from "../services/bitacoraService";
import { User } from "lucide-react";

const bitacoraColumnsGrid = [
  { key: "id", label: "ID", sortable: true },
  { key: "ci", label: "CI", sortable: true, width: "80px" },
  { key: "nombre", label: "Nombres", sortable: true },
  { key: "accion", label: "Accion", sortable: true },
  { key: "ip", label: "IP" },
  { key: "fecha_hora_legible", label: "Fecha y Hora", sortable: true },
];

const bitacoraColumnsCards = [
  { key: "fecha_hora_legible", label: "Fecha y Hora", icon: "Calendar" },
  { key: "id", label: "ID", icon: "SquareMinus" },
  { key: "ci", label: "CI", icon: "IdCard" },
];

const bitacoraColumnsCardExtended = [{ key: "ip", label: "IP", icon:"SquareMinus" }];

const GestionarBitacora = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [bitacora, setBitacora] = useState([]);
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
  const fetchBitacora = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir el objeto de ordenamiento para la API
      const apiOrdering = ordering.startsWith("-")
        ? `-${ordering.substring(1)}`
        : ordering;

      const data = await getBitacora({
        page,
        pageSize,
        search: debouncedSearch,
        ordering: apiOrdering,
      });

      setBitacora(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, ordering]); // Dependencias

  useEffect(() => {
    fetchBitacora();
  }, [fetchBitacora]); // El efecto se dispara cuando cambia la función fetchBitacora

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

  // HANDLERS NUEVOS - Para bitácora normalmente no se edita/elimina
  const handleAdd = () => {
    console.log("Agregar nueva entrada de bitácora");
  };

  const handleEdit = (item) => {
    console.log("Editar bitácora:", item);
  };

  const handleDelete = (id) => {
    // Confirmar antes de eliminar entrada de bitácora
    if (window.confirm("¿Está seguro de eliminar esta entrada de bitácora?")) {
      console.log("Eliminar bitácora con id:", id);
      // Aquí llamarías a deleteBitacora(id) si existe ese servicio
    }
  };

  return (
    <div style={{ padding: "0 var(--spacing-xl)" }}>
      <PageHeader
        title="Gestionar Bitácora"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentView={view}
        onViewChange={setView}
        onAdd={null}
        onReport={() => alert("Reporte...")}
      />
      {/* CONDICIONAL PARA DIFERENTES VISTAS */}
      {view === "grid" ? (
        <DataGrid
          loading={loading}
          error={error}
          data={bitacora}
          columns={bitacoraColumnsGrid}
          sortConfig={{
            key: ordering.replace("-", ""),
            direction: ordering.startsWith("-") ? "descending" : "ascending",
          }}
          onSort={handleSort}
          onEdit={null}
          onDelete={null}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--spacing-lg)",
          }}
        >
          {bitacora.map((bitacora) => (
            <Card
              key={bitacora.id}
              data={bitacora}
              columns={bitacoraColumnsCards}
              extendedColumns={bitacoraColumnsCardExtended}
              icon={User}
              titleField="nombre"
              subtitleField="accion"
              onEdit={null}
              onDelete={null}
            />
          ))}
        </div>
      )}
      {!loading && pagination && bitacora.length > 0 && (
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

export default GestionarBitacora;
