import React from 'react';
import './styles/MessageModal.css';

export default function MessageModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="message-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="message-modal-header">
          <h2>Mensaje</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="message-modal-body">
          <p>{message}</p>
        </div>
        
        <div className="message-modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}