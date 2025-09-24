import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import "./styles/Message.css";

export default function Message({
  type = "info",
  message,
  onClose,
  duration,
  closable = true, // Nueva prop para controlar si se puede cerrar
}) {
  const [isVisible, setIsVisible] = useState(true);

  const config = {
    success: {
      icon: CheckCircle,
      color: "var(--color-success)",
      bgColor: "var(--color-background-secondary)",
    },
    error: {
      icon: XCircle,
      color: "var(--color-error)",
      bgColor: "var(--color-background-secondary)",
    },
    warning: {
      icon: AlertTriangle,
      color: "var(--color-warning)",
      bgColor: "var(--color-background-secondary)",
    },
    info: {
      icon: Info,
      color: "var(--color-info)",
      bgColor: "var(--color-background-secondary)",
    },
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // Auto-cerrar si hay duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isVisible) return null;

  const { icon: Icon, color, bgColor } = config[type];

  return (
    <div
      className="message-container"
      style={{
        backgroundColor: bgColor,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div className="message-content">
        <Icon size={20} color={color} />
        <span className="message-text">{message}</span>
      </div>
      {closable && ( // Solo muestra el botón de cerrar si closable es true
        <button onClick={handleClose} className="message-close">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
