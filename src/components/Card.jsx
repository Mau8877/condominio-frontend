import React, { useState } from "react";
import * as Icons from "lucide-react";
import "./styles/Card.css";

const Card = ({
  data = {},
  columns = [],
  extendedColumns = [],
  icon: Icon = Icons.User, // ✅ default icon
  titleField = "first_name",
  subtitleField = "last_name",
  onEdit,
  onDelete,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Función para dar clases según estado
  const getStatusClass = (value) => {
    if (!value) return "";
    const val = value.toString().toLowerCase();
    if (val.includes("activo") || val === "true") return "status-active";
    if (val.includes("inactivo") || val === "false") return "status-inactive";
    return "";
  };

  // 🔑 Función que busca el icono dinámicamente
  const getIconComponent = (iconName) => {
    return Icons[iconName] || Icons.HelpCircle;
  };

  // 🔑 Función que obtiene valores anidados (ej: "dueño_info.nombre_completo")
  const getValueByPath = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  // 🔑 Obtener título y subtítulo dinámicamente
  const getDisplayTitle = () => {
    if (titleField && data[titleField]) return data[titleField];
    return "Usuario";
  };

  const getDisplaySubtitle = () => {
    if (subtitleField && data[subtitleField]) return data[subtitleField];
    return "";
  };

  return (
    <div className="card" onClick={() => setIsExpanded(!isExpanded)}>
      {/* Header compacto */}
      <div className="card-header">
        <div className="card-icon">
          <Icon size={35} />
        </div>
        <div className="card-title-section">
          <h3 className="card-title">{getDisplayTitle()}</h3>
          {getDisplaySubtitle() && (
            <span className="card-subtitle">{getDisplaySubtitle()}</span>
          )}
        </div>
        {extendedColumns.length > 0 && (
          <button
            className="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <Icons.ChevronUp size={16} />
            ) : (
              <Icons.ChevronDown size={16} />
            )}
          </button>
        )}
      </div>

      {/* Contenido principal */}
      <div className="card-content">
        {columns.map((col, index) => {
          const FieldIcon = getIconComponent(col.icon);
          const rawValue = getValueByPath(data, col.key);
          const value = col.formatter ? col.formatter(rawValue) : rawValue ?? "—";
          const isStatus = col.key === "estado";

          return (
            <div key={index} className="card-field">
              <div className="field-header">
                <FieldIcon size={14} />
                <span className="field-label">{col.label}:</span>
              </div>
              <span
                className={`field-value ${
                  isStatus ? getStatusClass(value) : ""
                }`}
              >
                {isStatus ? (value ? "Activo" : "Inactivo") : value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contenido extendido */}
      {isExpanded && extendedColumns.length > 0 && (
        <div className="card-content-extended">
          <div className="extended-divider"></div>
          {extendedColumns.map((col, index) => {
            const FieldIcon = getIconComponent(col.icon);
            const rawValue = getValueByPath(data, col.key);
            const value = col.formatter ? col.formatter(rawValue) : rawValue ?? "—";

            return (
              <div key={index} className="card-field extended">
                <div className="field-header">
                  <FieldIcon size={12} />
                  <span className="field-label extended-label">
                    {col.label}:
                  </span>
                </div>
                <span className="field-value extended-value">{value}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Acciones */}
      {(onEdit || onDelete) && (
        <div className="card-actions">
          {onEdit && (
            <button
              className="action-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(data);
              }}
            >
              <Icons.Edit3 size={14} />
              <span>Editar</span>
            </button>
          )}
          {onDelete && (
            <button
              className="action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(data.id);
              }}
            >
              <Icons.Trash2 size={14} />
              <span>Eliminar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
