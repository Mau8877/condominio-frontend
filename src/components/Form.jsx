// src/components/Form.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Message from "./Message";
import Loader from "./Loader";
import "./styles/Form.css";

const FormField = ({ field, value, onChange, disabled }) => {
  const handleChange = (e) => {
    onChange(field.key, e.target.value);
  };

  if (field.type === "select") {
    return (
      <div className="form-group">
        <label htmlFor={field.key}>{field.label}</label>
        <select
          id={field.key}
          value={value || ""}
          onChange={handleChange}
          required={field.required}
          disabled={disabled}
        >
          <option value="">Seleccione una opción</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="form-group">
        <label htmlFor={field.key}>{field.label}</label>
        <textarea
          id={field.key}
          value={value || ""}
          onChange={handleChange}
          placeholder={field.placeholder || ""}
          required={field.required}
          disabled={disabled}
          rows={field.rows || 4}
        />
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor={field.key}>{field.label}</label>
      <input
        id={field.key}
        type={field.type}
        value={value || ""}
        onChange={handleChange}
        placeholder={field.placeholder || ""}
        required={field.required}
        disabled={disabled}
      />
    </div>
  );
};

const Form = ({
  title,
  fields,
  initialData,
  onSubmit,
  backUrl,
  loading,
  message,
  onMessageClose,
  submitText,
  mode = "create",
  onFieldChange,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      const defaultState = {};
      fields.forEach((field) => {
        defaultState[field.key] = initialData[field.key] ?? "";
      });
      setFormData(defaultState);
    }
  }, [initialData, fields]);

  const handleFieldChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));

    if (onFieldChange) {
      onFieldChange(key, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onSubmit(formData);
    }
  };

  // Si estamos en modo edición y no hay initialData, mostrar loading
  if (mode === "edit" && !initialData && loading) {
    return (
      <div className="form-container">
        <div className="form-loading">
          <Loader size="medium" text="Cargando datos..." variant="subtle" />
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      {title && <h1>{title}</h1>}

      <form onSubmit={handleSubmit}>
        {/* Campos del formulario */}
        {fields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={formData[field.key] || ""}
            onChange={handleFieldChange}
            disabled={loading}
          />
        ))}

        <div className="form-actions">
          {message && (
            <div className="form-message-above-buttons">
              <Message
                type={message.type}
                message={message.text}
                onClose={onMessageClose}
                duration={message.duration}
                closable={message.closable}
              />
            </div>
          )}

          {backUrl && (
            <Link to={backUrl} className="button-secondary">
              Cancelar
            </Link>
          )}

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? (
              <div className="button-loading-content">
                <Loader size="small" variant="subtle" />
                <span>Guardando...</span>
              </div>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
