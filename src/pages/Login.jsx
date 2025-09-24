import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ci: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("CI o contraseña incorrectos");
      }

      const data = await response.json();

      // Guardar token en localStorage (para usarlo luego en fetchs protegidos)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // Redirigir según el tipo de usuario
      switch (data.tipo) {
        case "Administrador":
          navigate("/adminlayout");
          break;
        case "Residente":
        case "Copropietario":
          navigate("/crlayout");
          break;
        case "Guardia":
          navigate("/guardialayout");
          break;
        case "Trabajador":
          navigate("/trabajadorlayout");
          break;
        default:
          setError("Tipo de usuario no reconocido");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Condominio Inteligente" className="logo" />
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

          {/* Error */}
          {error && <p className="error-message">{error}</p>}

          {/* Botón de Login */}
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
