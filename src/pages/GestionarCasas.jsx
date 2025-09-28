import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import DataGrid from "../components/DataGrid";
import AdvancedPagination from "../components/AdvancedPagination";
import { getCasas, getCasaById } from "../services/casaService";
import { useDebounce } from "../hooks/useDebounce";
import { House } from "lucide-react";

const ColumnsGrid = [
  { key: "id", label: "ID", sortable: true },
  { key: "nro", label: "Número", sortable: true },
  { key: "id_calle_nombre", label: "Calle", sortable: true },
  { key: "estado", label: "Estado", sortable: true },
  { key: "area_terreno", label: "Área (m²)", sortable: true },
  { key: "nro_habitaciones", label: "Habitaciones", sortable: true },
  { key: "nro_baños", label: "Baños", sortable: true },
];

const ColumnsCard = [
  { key: "id", label: "ID", icon: "Hash" },
  { key: "direccion_completa", label: "Dirección", icon: "Home" },
  { key: "nro", label: "Número", icon: "Number" },
  { key: "id_calle_nombre", label: "Calle", icon: "MapPin" },
];

const ColumnsCardExtended = [
  { key: "color", label: "Color", icon: "Palette" },
  { key: "area_terreno", label: "Área", icon: "Square" },
  {
    key: "estado",
    label: "Estado",
    icon: "Circle",
  },
  { key: "nro_habitaciones", label: "Habitaciones", icon: "Bed" },
  { key: "nro_baños", label: "Baños", icon: "Bath" },
  {
    key: "dueño_info.nombre_completo",
    label: "Dueño",
    icon: "User",
  },
  {
    key: "fecha_registro",
    label: "Registro",
    icon: "Calendar",
  },
];

const Fields = [
  {
    key: "nro",
    label: "Número de Casa",
    type: "number",
    required: true,
    placeholder: "Ingrese el número de casa",
    min: 1,
  },
  {
    key: "id_calle",
    label: "Calle",
    type: "select",
    required: true,
    options: "calles", // Esto cargaría las opciones desde la API
    placeholder: "Seleccione una calle",
  },
  {
    key: "id_dueño_casa",
    label: "Dueño de Casa",
    type: "select",
    required: true,
    options: "copropietarios", // Cargar copropietarios desde API
    placeholder: "Seleccione el dueño",
  },
  {
    key: "nro_habitaciones",
    label: "Número de Habitaciones",
    type: "number",
    required: true,
    placeholder: "Ingrese número de habitaciones",
    min: 0,
  },
  {
    key: "nro_baños",
    label: "Número de Baños",
    type: "number",
    required: true,
    placeholder: "Ingrese número de baños",
    min: 0,
  },
  {
    key: "ancho",
    label: "Ancho (metros)",
    type: "number",
    required: true,
    placeholder: "Ancho del terreno",
    min: 1,
    step: 0.1,
  },
  {
    key: "largo",
    label: "Largo (metros)",
    type: "number",
    required: true,
    placeholder: "Largo del terreno",
    min: 1,
    step: 0.1,
  },
  {
    key: "color",
    label: "Color de la Casa",
    type: "text",
    required: false,
    placeholder: "Color exterior de la casa",
  },
  {
    key: "fecha_construccion",
    label: "Fecha de Construcción",
    type: "date",
    required: false,
    placeholder: "Fecha de construcción",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    type: "textarea",
    required: false,
    placeholder: "Observaciones adicionales sobre la casa",
    rows: 3,
  },
];

const GestionarCasas = () => {
  // Estado principal de la UI
  const [loading, setLoading] = useState(true);
  const [casa, setCasa] = useState([]);
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
  const fetchCasa = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir el objeto de ordenamiento para la API
      const apiOrdering = ordering.startsWith("-")
        ? `-${ordering.substring(1)}`
        : ordering;

      const data = await getCasas({
        page,
        pageSize,
        search: debouncedSearch,
        ordering: apiOrdering,
      });

      setCasa(
        data.results.map((c) => ({
          ...c,
          estado: c.ocupada ? "Ocupada" : "Disponible",
        }))
      );
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, ordering]); // Dependencias

  useEffect(() => {
    fetchCasa();
  }, [fetchCasa]);

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
    navigate("/adminlayout/crear-casa");
  };

  const handleEdit = (casa) => {
    navigate(`/adminlayout/editar-casa/${casa.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta casa?")) {
      try {
        await deleteCasa(id);
        alert("Casa eliminado exitosamente");
        fetchCasa();
      } catch (error) {
        alert("Error al eliminar Casa: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "0 var(--spacing-xl)" }}>
      <PageHeader
        title="Gestión de Casas"
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
          data={casa}
          columns={ColumnsGrid}
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
          {casa.map((casa) => (
            <Card
              key={casa.id}
              data={casa}
              columns={ColumnsCard}
              extendedColumns={ColumnsCardExtended}
              icon={House}
              titleField="nro"
              subtitleField="direccion_completa"
              onEdit={() => handleEdit(casa)}
              onDelete={() => handleDelete(casa.id)}
            />
          ))}
        </div>
      )}
      {!loading && pagination && casa.length > 0 && (
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

export default GestionarCasas;
