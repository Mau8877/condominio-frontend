import React from 'react';
import { Plus, FileText, LayoutGrid, List } from 'lucide-react';
import './styles/PageHeader.css';

/**
 * Encabezado de página con título, acciones y cambio de vista.
 * @param {string} title - Título de la página.
 * @param {function} onAdd - Callback para el botón 'Añadir'.
 * @param {function} onReport - Callback para el botón 'Reporte'.
 * @param {string} currentView - Vista actual ('grid' o 'card').
 * @param {function} onViewChange - Callback que se llama con la nueva vista.
 */

const PageHeader = ({ title, onAdd, onReport, currentView, onViewChange }) => {
  return (
    <header className="page-header">
      <h1 className="page-header-title">{title}</h1>
      <div className="page-header-controls">
        <div className="view-toggle">
          <button 
            className={`toggle-button ${currentView === 'grid' ? 'active' : ''}`}
            onClick={() => onViewChange('grid')}
            aria-label="Vista de tabla"
          >
            <List size={20} />
          </button>
          <button 
            className={`toggle-button ${currentView === 'card' ? 'active' : ''}`}
            onClick={() => onViewChange('card')}
            aria-label="Vista de tarjetas"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
        <button className="page-header-action-button secondary" onClick={onReport}>
          <FileText size={20} />
          Reporte
        </button>
        <button className="page-header-action-button" onClick={onAdd}>
          <Plus size={20} />
          Añadir
        </button>
      </div>
    </header>
  );
};

export default PageHeader;