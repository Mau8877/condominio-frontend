import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSort,
  faSortUp,
  faSortDown,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader"; // Asegúrate de que este componente exista en tu proyecto
import "./styles/GestionarList.css"; // Asegúrate de tener el archivo de estilos

export default function GestionarList({
  apiUrl,
  title = "Gestión de Datos",
  columns = [],
  onEdit,
  onDelete,
  onAdd,
  refreshTrigger,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Mostrar el loader antes de cada nueva carga de datos
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          credentials: "include", // Esencial para enviar la cookie de sesión
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Opcional: Manejar errores de sesión expirada
          if (response.status === 401 || response.status === 403) {
            console.error("Acceso denegado o sesión expirada.");
            // Aquí podrías redirigir al login:
            // window.location.href = '/login';
          }
          throw new Error("No se pudieron obtener los datos del servidor.");
        }

        const result = await response.json();
        setData(result); // <-- CORRECCIÓN: Usar setData para actualizar el estado
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Limpiar los datos si hay un error para evitar mostrar info vieja
      } finally {
        setLoading(false); // <-- CORRECCIÓN: Ocultar el loader al finalizar, con o sin error
      }
    };

    fetchData();
  }, [apiUrl, refreshTrigger]); // Se ejecuta cuando la URL o el trigger de refresco cambian

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current ? current[key] : undefined;
    }, obj);
  };
  
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    // Ordenar los datos basándose en la configuración
    const sortedData = [...data].sort((a, b) => {
      const aValue = getNestedValue(a, key);
      const bValue = getNestedValue(b, key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === "ascending" ? faSortUp : faSortDown;
  };

  // Muestra el loader mientras los datos están cargando
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="gestionar-list-container">
      <div className="list-header">
        <h2>{title}</h2>
        {onAdd && (
          <button className="btn btn-primary btn-add" onClick={onAdd}>
            <FontAwesomeIcon icon={faPlus} /> Agregar
          </button>
        )}
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={column.sortable ? "sortable-header" : ""}
                  style={{ width: column.width }}
                >
                  <div className="header-content">
                    <span className="header-label">{column.label}</span>
                    {column.sortable && (
                      <FontAwesomeIcon
                        icon={getSortIcon(column.key)}
                        className="sort-icon"
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="actions-header">
                <div className="header-content">
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="no-data">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="data-row">
                  {columns.map((column) => (
                    <td key={column.key} className="data-cell">
                      {column.render
                        ? column.render(getNestedValue(item, column.key), item)
                        : getNestedValue(item, column.key)}
                    </td>
                  ))}
                  <td className="actions-cell">
                    <div className="action-buttons">
                      {onEdit && (
                        <button
                          className="btn-edit"
                          onClick={() => onEdit(item)}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="btn-delete"
                          onClick={() => onDelete(item)}
                          title="Eliminar"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}