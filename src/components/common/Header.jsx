import React, { useState } from 'react';
import './styles/Header.css';
import { Navigate, useNavigate }  from 'react-router-dom';
export default function Header({ title, userName }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditProfile = () => {
    console.log("Editar perfil");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    console.log("cierre de sesion exitoso");
    navigate("/login")
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      
      <div className="header-right">
        <span className="welcome-text">Bienvenido {userName}</span>
        
        <div className="dropdown">
          <button className="header-button" onClick={toggleMenu}>
            Opciones
            <span className={`dropdown-arrow ${isMenuOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleEditProfile}>
                Editar perfil
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}