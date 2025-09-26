import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../components/Form";
import {
  getCalleById,
  createCalle,
  updateCalle,
} from "../services/calleService";

export default function CrearEditarCalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});

  // Campos de formulario (en este caso solo "nombre")
  const calleFields = useMemo(
    () => [
      {
        key: "nombre",
        label: "Nombre de la Calle",
        type: "text",
        required: true,
      },
    ],
    []
  );

  // Cargar datos si estamos editando
  useEffect(() => {
    const loadCalleData = async () => {
      if (!isEditing) return;
      setLoading(true);
      try {
        const calle = await getCalleById(id);
        setFormData(calle);
      } catch (error) {
        console.error("Error al cargar calle:", error);
        setMessage({
          type: "error",
          text: "No se pudieron cargar los datos de la calle.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCalleData();
  }, [id, isEditing]);

  // Cambio de campos
  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Guardar (crear/editar)
  const handleSubmit = async (submittedData) => {
    setLoading(true);
    setMessage(null);
    try {
      if (isEditing) {
        await updateCalle(id, submittedData);
        setMessage({ type: "success", text: "Calle actualizada con éxito" });
      } else {
        await createCalle(submittedData);
        setMessage({ type: "success", text: "Calle creada con éxito" });
      }
      setTimeout(() => navigate("/adminlayout/gestionar-calles"), 2000);
    } catch (error) {
      console.error("Error al guardar calle:", error);
      setMessage({
        type: "error",
        text: isEditing
          ? "Error al actualizar la calle"
          : "Error al crear la calle",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      title={isEditing ? "Editar Calle" : "Crear Nueva Calle"}
      fields={calleFields}
      initialData={formData}
      onSubmit={handleSubmit}
      backUrl="/adminlayout/gestionar-calles"
      loading={loading}
      message={message}
      onMessageClose={() => setMessage(null)}
      submitText={isEditing ? "Actualizar Calle" : "Crear Calle"}
      mode={isEditing ? "edit" : "create"}
      onFieldChange={handleFieldChange}
    />
  );
}
