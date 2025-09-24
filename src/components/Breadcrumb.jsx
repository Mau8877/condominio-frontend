import React from 'react';
import { ChevronRight } from 'lucide-react';
import './styles/Breadcrumb.css';

/**
 * Muestra una ruta de navegación (breadcrumb).
 * @param {Array<{label: string, link?: string}>} items - Array de objetos para cada miga de pan.
 */
const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index > 0 && <ChevronRight size={16} className="breadcrumb-separator" />}
            {item.link ? (
              <a href={item.link} className="breadcrumb-link">{item.label}</a>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;