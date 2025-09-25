import React, { useState } from "react";
import {
  User,
  Mail,
  BadgeInfo,
  Shield,
  Calendar,
  Phone,
  IdCard,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./styles/Card.css";

// Mapeo de iconos por nombre
const iconComponents = {
  User,
  Mail,
  BadgeInfo,
  Shield,
  Calendar,
  Phone,
  IdCard,
  Edit3,
  Trash2,
};

const Card = ({
  data = {},
  columns = [],
  extendedColumns = [],
  icon: Icon = User,
  titleField = "first_name", 
  subtitleField = "last_name", 
  onEdit,
  onDelete,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusClass = (value) => {
    if (!value) return "";
    const val = value.toString().toLowerCase();
    if (val.includes("activo") || val === "true") return "status-active";
    if (val.includes("inactivo") || val === "false") return "status-inactive";
    return "";
  };

  // Función para obtener el componente de icono
  const getIconComponent = (iconName) => {
    return iconComponents[iconName] || User;
  };

  // Obtener título y subtítulo dinámicamente
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
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* Contenido principal - siempre visible */}
      <div className="card-content">
        {columns.map((col, index) => {
          const FieldIcon = getIconComponent(col.icon);
          const value = data[col.key] ?? "—";
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

      {/* Contenido extendido - estilo gris y compacto */}
      {isExpanded && extendedColumns.length > 0 && (
        <div className="card-content-extended">
          <div className="extended-divider"></div>
          {extendedColumns.map((col, index) => {
            const FieldIcon = getIconComponent(col.icon);
            const value = data[col.key] ?? "—";

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
              <Edit3 size={14} />
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
              <Trash2 size={14} />
              <span>Eliminar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
