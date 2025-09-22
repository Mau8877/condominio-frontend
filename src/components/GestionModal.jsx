import React, { useState, useEffect } from 'react';
import './styles/GestionModal.css';

export default function GestionModal({ isOpen, onClose, onSave, item, fields, title }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      const initialData = fields.reduce((acc, field) => {
        const value = field.key.split('.').reduce((o, i) => (o ? o[i] : ''), item);
        acc[field.key] = Array.isArray(value) ? value.join(', ') : (value || '');
        return acc;
      }, {});
      setFormData(initialData);
    } else {
      const initialData = fields.reduce((acc, field) => {
        acc[field.key] = '';
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [item, fields, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {fields.map(field => (
            <div className="form-group" key={field.key}>
              <label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="required-asterisk">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                id={field.key}
                name={field.key}
                value={formData[field.key] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                required={field.required}
                className="form-input"
              />
              {field.description && (
                <p className="field-description">{field.description}</p>
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}