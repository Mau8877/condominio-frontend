import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

export default function AdminDashboard() {
  // Función de ejemplo para handleClose
  const handleClose = () => {
    console.log("Mensaje cerrado");
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Demostración de Loaders */}
      <div className="demo-section">
        <h2>Loaders</h2>
        <Loader />
        <Loader size="large" text="Cargando usuarios..." />
        <Loader size="small" text="Pequeño" />
        <Loader color="var(--color-error)" text="Loader rojo" />
      </div>

      {/* Demostración de Messages */}
      <div className="demo-section">
        <h2>Messages</h2>
        <h2>Messages</h2>

        {/* Mensaje que NO se puede cerrar */}
        <Message
          type="success"
          message="Usuario guardado correctamente"
          closable={false} // No muestra el botón X
        />

        {/* Mensaje que SÍ se puede cerrar manualmente */}
        <Message
          type="error"
          message="Error al conectar"
          onClose={handleClose}
          closable={true} // Valor por defecto, puedes omitirlo
        />

        {/* Mensaje que se cierra automáticamente después de 3 segundos */}
        <Message
          type="info"
          message="Sistema actualizado"
          duration={3000} // 3 segundos
        />

        {/* Mensaje que NO se cierra ni manual ni automáticamente */}
        <Message
          type="warning"
          message="Advertencia del sistema"
          closable={false}
          // Sin duration, sin onClose
        />

        {/* Mensaje que se cierra automáticamente pero NO manualmente */}
        <Message
          type="info"
          message="Mensaje temporal sin botón de cerrar"
          duration={5000} // 5 segundos
          closable={false} // No se puede cerrar manualmente
        />
      </div>
    </div>
  );
}
