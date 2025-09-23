import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react"; // Solo importamos los iconos necesarios
import "./styles/Sidebar.css";

export default function Sidebar({ menuPackages }) {
  const location = useLocation();
  const [openPackages, setOpenPackages] = useState({});
  const [openSide, setOpenSide] = useState(false);
  const sidebarRef = useRef(null);

  // Cerrar sidebar al hacer clic fuera o al cambiar de ruta
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.classList.contains("hamburger-btn")
      ) {
        setOpenSide(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenSide(false);
  }, [location.pathname]);

  const togglePackage = (packageName) => {
    setOpenPackages((prev) => ({
      ...prev,
      [packageName]: !prev[packageName],
    }));
  };

  const toggleSidebar = () => {
    setOpenSide(!openSide);
  };

  const isActive = (path) => {
    // La lógica de isActive sigue funcionando para las subrutas
    return (
      location.pathname.endsWith(`/AdminLayout/${path}`) ||
      location.pathname.endsWith(`/AdminLayout/${path}/`)
    );
  };

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {openSide && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      <aside className={`sidebar ${openSide ? "open" : ""}`} ref={sidebarRef}>
        <div className="sidebar-header">
          {/* Título más compacto */}
          <h2 className="sidebar-title">Panel de Administración</h2>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {/* El botón de Dashboard ha sido eliminado */}

            {menuPackages.map((pkg, index) => (
              <li key={index} className="sidebar-package">
                <div
                  className="sidebar-package-header"
                  onClick={() => togglePackage(pkg.name)}
                >
                  <span className="package-name">{pkg.name}</span>
                  <ChevronDown
                    size={16}
                    className={`package-arrow ${
                      openPackages[pkg.name] ? "open" : ""
                    }`}
                  />
                </div>

                <ul
                  className={`package-items ${
                    openPackages[pkg.name] ? "open" : ""
                  }`}
                >
                  {pkg.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="sidebar-item">
                      <Link
                        to={item.path}
                        className={`sidebar-link ${
                          isActive(item.path) ? "active" : ""
                        }`}
                      >
                        {item.icon && (
                          <span className="sidebar-icon">{item.icon}</span>
                        )}
                        <span className="sidebar-label">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <p>Sistema de Administración v1.0</p>
        </div>
      </aside>
    </>
  );
}
