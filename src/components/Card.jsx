import React from "react";
import "./styles/Card.css";

const Card = ({ title, columns = [], data = {} }) => {
  const getStatusClass = (value) => {
    if (!value) return "";
    const val = value.toLowerCase();
    if (val.includes("activo")) return "status-active";
    if (val.includes("inactivo")) return "status-inactive";
    if (val.includes("pendiente")) return "status-pending";
    if (val.includes("completado")) return "status-completed";
    return "";
  };

  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {columns.map((col, index) => {
          const value = data[col.key] ?? "—";
          return (
            <div key={index} className="card-row">
              <span className="card-label">{col.label}:</span>
              <span
                className={`card-value ${col.key === "estado" ? getStatusClass(value) : ""}`}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
