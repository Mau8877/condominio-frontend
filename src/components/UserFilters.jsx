// src/components/UserFilters.js no usado
import React from "react";

// Asumimos que estos son los posibles valores
const TIPO_OPTIONS = ["admin", "editor", "viewer"];
const ESTADO_OPTIONS = [
  { label: "Activo", value: "true" },
  { label: "Inactivo", value: "false" },
];

const UserFilters = ({ filters, onFilterChange }) => {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div
      className="filters-container"
      style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
    >
      <select
        name="tipo"
        value={filters.tipo || ""}
        onChange={handleSelectChange}
      >
        <option value="">Todo tipo</option>
        {TIPO_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select
        name="estado"
        value={filters.estado || ""}
        onChange={handleSelectChange}
      >
        <option value="">Cualquier estado</option>
        {ESTADO_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => {
          onFilterChange("tipo", "");
          onFilterChange("estado", "");
        }}
      >
        Limpiar Filtros
      </button>
    </div>
  );
};

export default UserFilters;
