import React from "react";
import { Plus, FileText, LayoutGrid, List, ChevronRight } from "lucide-react";
import SearchBar from "./SearchBar";
import "./styles/PageHeader.css";

const PageHeader = ({
  title,
  searchTerm,
  onSearchChange,
  currentView,
  onViewChange,
  onAdd,
  onReport,
}) => {
  return (
    <header className="page-header-container">
      <div className="page-header-main">
        <h1 className="page-header-title">{title}</h1>
        <div className="page-header-controls">
          <SearchBar value={searchTerm} onChange={onSearchChange} />
          <div className="view-toggle">
            <button 
              className={`toggle-button ${currentView === 'grid' ? 'active' : ''}`} 
              onClick={() => onViewChange('grid')}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              className={`toggle-button ${currentView === 'card' ? 'active' : ''}`} 
              onClick={() => onViewChange('card')}
            >
              <List size={20} />
            </button>
          </div>
          <button className="page-header-action-button secondary" onClick={onReport}>
            <FileText size={20} />
            <span>Reporte</span>
          </button>
          <button className="page-header-action-button" onClick={onAdd}>
            <Plus size={20} />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;