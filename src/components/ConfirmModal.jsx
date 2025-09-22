import React from 'react';
import './styles/ConfirmModal.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        
        <div className="confirm-modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            No, Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}