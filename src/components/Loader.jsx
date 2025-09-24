import React from "react";
import { Loader as LoaderIcon } from "lucide-react";
import "./styles/Loader.css";

export default function Loader({
  size = "medium",
  color = "var(--color-primary-500)",
  text,
  variant = "default",
}) {
  const sizeMap = {
    small: {
      icon: 20,
      textClass: "loader-text--small",
      containerClass: "loader-container--small",
    },
    medium: {
      icon: 24,
      textClass: "loader-text--medium",
      containerClass: "loader-container--medium",
    },
    large: {
      icon: 32,
      textClass: "loader-text--large",
      containerClass: "loader-container--large",
    },
  };

  const variantStyles = {
    default: "loader--default",
    subtle: "loader--subtle",
    elevated: "loader--elevated",
  };

  const currentSize = sizeMap[size];
  const currentVariant = variantStyles[variant];

  return (
    <div className={`loader ${currentVariant} ${currentSize.containerClass}`}>
      <div className="loader__spinner">
        <LoaderIcon size={currentSize.icon} color={color} />
      </div>
      {text && (
        <p
          className={`loader__text ${currentSize.textClass}`}
          style={color ? { color } : {}}
        >
          {text}
        </p>
      )}
    </div>
  );
}

/*
Variante	Uso recomendado	      Ejemplo en condominio
default	  Cargas generales	    Dashboard principal
subtle	  Tarjetas, secciones	  Lista de residentes
elevated	Operaciones críticas	Procesar pagos
*/
