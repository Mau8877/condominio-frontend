//revisar si esta ok
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import DataGrid from "../components/DataGrid";
import AdvancedPagination from "../components/AdvancedPagination";
import { getMorosidad } from "../services/morosidadService";
import { useDebounce } from "../hooks/useDebounce";
import { AlertTriangle, Hash } from "lucide-react";

const ColumnsGrid = [
  { key: "id", label: "ID", sortable: true, width: "80px" },
  {
    key: "id_tipo_morosidad.descripcion",
    label: "Descripción",
    sortable: true,
  },
  { 
    key: "id_casa_info.direccion", 
    label: "Dirección", 
    sortable: true 
  },
  { 
    key: "id_casa_info.dueño", 
    label: "Dueño", 
    sortable: true 
  },
  { key: "id_tipo_morosidad.alerta", label: "Alerta", sortable: true },
  { key: "id_tipo_morosidad.grado", label: "Grado", sortable: true },
  { key: "fecha_actualizacion", label: "Fecha Actualización", sortable: true },
];

const ColumnsCard = [
  { key: "id", label: "ID", icon: "IdCard" },
  { key: "estado", label: "Estado", icon: "Shield" },
  {
    key: "id_tipo_morosidad.descripcion",
    label: "Descripción",
    icon: "ClipboardList",
  },
  { 
    key: "id_casa_info.direccion",
    label: "Dirección", 
    icon: "Home" 
  },
  { 
    key: "id_casa_info.dueño",
    label: "Dueño", 
    icon: "User" 
  },
];

const ColumnsCardExtended = [
  { 
    key: "id_casa_info.color",
    label: "Color Casa", 
    icon: "Palette" 
  },
  { 
    key: "casa_ocupada",
    label: "Disp Casa", 
    icon: "DoorOpen"
  },
  { key: "id_tipo_morosidad.alerta", label: "Alerta", icon: "TriangleAlert" },
  { key: "id_tipo_morosidad.grado", label: "Grado", icon: "Megaphone" },
  {
    key: "fecha_actualizacion",
    label: "Fecha Actualización",
    icon: "Calendar",
  },
];

const MonitorearMorosidad = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [morosidad, setMorosidad] = useState([]);
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
  const fetchMorosidad = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir el objeto de ordenamiento para la API
      const apiOrdering = ordering.startsWith("-")
        ? `-${ordering.substring(1)}`
        : ordering;

      const data = await getMorosidad({
        page,
        pageSize,
        search: debouncedSearch,
        ordering: apiOrdering,
      });

      setMorosidad(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, ordering]); // Dependencias

  useEffect(() => {
    fetchMorosidad();
  }, [fetchMorosidad]); // El efecto se dispara cuando cambia la función fetchMorosidad

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
      // Aquí llamarías a deleteMorosidad(id) si existe ese servicio
    }
  };

  return (
    <div style={{ padding: "0 var(--spacing-xl)" }}>
      <PageHeader
        title="Monitorear Morosidad"
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
          data={morosidad}
          columns={ColumnsGrid}
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
          {morosidad.map((morosidad) => (
            <Card
              key={morosidad.id}
              data={morosidad}
              columns={ColumnsCard}
              extendedColumns={ColumnsCardExtended}
              icon={Hash}
              titleField="id"
              subtitleField="id_tipo_morosidad.descripcion"
              onEdit={null}
              onDelete={null}
            />
          ))}
        </div>
      )}
      {!loading && pagination && morosidad.length > 0 && (
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

export default MonitorearMorosidad;
