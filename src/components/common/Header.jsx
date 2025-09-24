import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Settings, LogOut, User, UserPen } from "lucide-react";
import "./styles/Header.css";

export default function Header({ logo, title, userName, navigation = "/" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogoClick = () => {
    navigate(navigation.startsWith("/") ? navigation : `/${navigation}`);
  };

  const handleEditProfile = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Logo y título */}
      <div className="header__brand" onClick={handleLogoClick}>
        {logo ? (
          <img src={logo} alt={title} className="header__logo" />
        ) : (
          <Building className="header__logo-icon" size={32} />
        )}
        <h1 className="header__title">{title}</h1>
      </div>

      {/* Menú de usuario */}
      <div className="header__user-menu" ref={dropdownRef}>
        <div className="user-dropdown">
          <button
            className={`user-dropdown__trigger ${
              isMenuOpen ? "user-dropdown__trigger--open" : ""
            }`}
            onClick={toggleMenu}
            aria-label="Menú de usuario"
          >
            <Settings size={24} className="user-dropdown__icon" />
          </button>

          {isMenuOpen && (
            <div className="user-dropdown__menu">
              {/* Información del usuario */}
              <div className="user-dropdown__header">
                <div className="user-dropdown__avatar">
                  <User size={18} />
                </div>
                <div className="user-dropdown__info">
                  <span className="user-dropdown__name">{userName}</span>
                  <span className="user-dropdown__role">Administrador</span>
                </div>
              </div>

              <div className="user-dropdown__divider"></div>

              {/* Opciones del menú */}
              <button
                className="user-dropdown__item user-dropdown__item--edit"
                onClick={handleEditProfile}
              >
                <UserPen size={18} className="user-dropdown__item-icon" />
                <span>Editar perfil</span>
              </button>

              <button
                className="user-dropdown__item user-dropdown__item--logout"
                onClick={handleLogout}
              >
                <LogOut size={18} className="user-dropdown__item-icon" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
