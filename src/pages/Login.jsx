import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import logo from '../assets/logo.png';
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ci: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de login:", formData);
    navigate("/adminlayout");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-container">
          <img
            src={logo}
            alt="Condominio Inteligente"
            className="logo"
          />
        </div>

        {/* Título */}
        <h1 className="login-title">Smart Condominium</h1>
        <p className="login-subtitle">Acceso al sistema</p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Input CI */}
          <div className="input-group">
            <div className="input-icon">
              <User size={20} />
            </div>
            <input
              type="text"
              name="ci"
              placeholder="Cédula de Identidad"
              value={formData.ci}
              onChange={handleChange}
              className="login-input"
              required
            />
          </div>

          {/* Input Password */}
          <div className="input-group">
            <div className="input-icon">
              <Lock size={20} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              required
            />
          </div>

          {/* Botón de Login */}
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>

        {/* Link de Registro */}
        <div className="register-link">
          <a href="/registro" className="register-text">
            ¿No tienes cuenta? <span>Regístrate</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
