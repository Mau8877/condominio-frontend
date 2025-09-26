import React from "react";
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import "./styles/DataTable.css";
import { getNestedValue } from "../utils/dataUtils";

/**
 * Muestra datos en una tabla con opciones y ordenamiento.
 * @param {Array<object>} data - Los datos a mostrar.
 * @param {Array<object>} columns - Definición de las columnas.
 * @param {function} onEdit - Callback para editar un item.
 * @param {function} onDelete - Callback para eliminar un item.
 * @param {object} sortConfig - Configuración actual de ordenamiento.
 * @param {function} onSort - Callback para cambiar el ordenamiento.
 */
const DataTable = ({ data, columns, onEdit, onDelete, sortConfig, onSort }) => {
  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowDown size={14} className="sort-icon neutral" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className="sort-icon active" />
    ) : (
      <ArrowDown size={14} className="sort-icon active" />
    );
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort(col.key)}
                className={col.sortable ? "sortable" : ""}
              >
                {col.label}
                {col.sortable && renderSortIcon(col.key)}
              </th>
            ))}
            {(onEdit || onDelete) && <th>Opciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={`${item.id}-${col.key}`}>
                  {getNestedValue(item, col.key)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="options-cell">
                  {onEdit && (
                    <button
                      className="icon-button edit"
                      onClick={() => onEdit(item)}
                      aria-label="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="icon-button delete"
                      onClick={() => onDelete(item.id)}
                      aria-label="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
