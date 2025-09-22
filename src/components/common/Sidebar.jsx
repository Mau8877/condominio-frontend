import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/Sidebar.css";

export default function Sidebar({ menuPackages }) {
  const location = useLocation();
  const [openPackages, setOpenPackages] = useState({});
  const [openSide, setOpenSide] = useState(false);

  const togglePackage = (packageName) => {
    setOpenPackages((prev) => ({
      ...prev,
      [packageName]: !prev[packageName],
    }));
  };

  const toggleSidebar = () => {
    setOpenSide(!openSide);
  };

  // Función para verificar si la ruta está activa
  const isActive = (path) => {
    // Para la ruta por defecto (index)
    if (path === "" && location.pathname.endsWith("/AdminLayout")) {
      return true;
    }

    // Para rutas hijas
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
        ☰
      </button>
      {openSide && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 899,
          }}
        />
      )}
      <aside className={`sidebar ${openSide ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2
            style={{ textAlign: "center", color: "black", fontWeight: "bold" }}
          >
            Panel de Administración
          </h2>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {/* Enlace al dashboard (ruta por defecto) */}
            <li className="sidebar-item">
              <Link
                to=""
                className={`sidebar-link ${
                  location.pathname.endsWith("/AdminLayout") ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">-</span>
                <span className="sidebar-label">Dashboard</span>
              </Link>
            </li>

            {menuPackages.map((pkg, index) => (
              <li key={index} className="sidebar-package">
                <div
                  className="sidebar-package-header"
                  onClick={() => togglePackage(pkg.name)}
                >
                  <span className="package-name">{pkg.name}</span>
                  <span
                    className={`package-arrow ${
                      openPackages[pkg.name] ? "open" : ""
                    }`}
                  >
                    ▼
                  </span>
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