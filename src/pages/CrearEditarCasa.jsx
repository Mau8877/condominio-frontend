import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../components/Form";
import {
  getCasaById,
  createCasa,
  updateCasa,
  getCopropietarios,
} from "../services/casaService";
import { getCalles } from "../services/calleService";

export default function CrearEditarCasa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [calles, setCalles] = useState([]);
  const [copropietarios, setCopropietarios] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  // Campos de formulario para Casa
  const casaFields = useMemo(
    () => [
      {
        key: "nro",
        label: "Número de Casa",
        type: "number",
        required: true,
        placeholder: "Ingrese el número de casa",
        min: 1,
      },
      {
        key: "id_calle",
        label: "Calle",
        type: "select",
        required: true,
        options: calles.map((calle) => ({
          value: calle.id,
          label: calle.nombre,
        })),
        placeholder: "Seleccione una calle",
      },
      {
        key: "id_dueño_casa",
        label: "Dueño de Casa",
        type: "select",
        required: false,
        options: [
          { value: "", label: "🔵 Sin dueño (Disponible)" },
          ...copropietarios.map((coprop) => ({
            value: coprop.usuario.id,
            label: `${coprop.usuario.first_name} ${coprop.usuario.last_name} (CI: ${coprop.usuario.ci})`,
          })),
        ],
        placeholder: "Seleccione el dueño",
      },
      {
        key: "ocupada_display",
        label: "Estado de la Casa",
        type: "text",
        required: false,
        readOnly: true,
        placeholder: "Se actualiza automáticamente",
      },
      {
        key: "nro_habitaciones",
        label: "Número de Habitaciones",
        type: "number",
        required: true,
        placeholder: "Ingrese número de habitaciones",
        min: 0,
      },
      {
        key: "nro_baños",
        label: "Número de Baños",
        type: "number",
        required: true,
        placeholder: "Ingrese número de baños",
        min: 0,
      },
      {
        key: "ancho",
        label: "Ancho (metros)",
        type: "number",
        required: true,
        placeholder: "Ancho del terreno",
        min: 1,
        step: 0.1,
      },
      {
        key: "largo",
        label: "Largo (metros)",
        type: "number",
        required: true,
        placeholder: "Largo del terreno",
        min: 1,
        step: 0.1,
      },
      {
        key: "color",
        label: "Color de la Casa",
        type: "text",
        required: false,
        placeholder: "Color exterior de la casa",
      },
      {
        key: "fecha_construccion",
        label: "Fecha de Construcción",
        type: "date",
        required: false,
        placeholder: "Fecha de construcción",
      },
      {
        key: "observaciones",
        label: "Observaciones",
        type: "textarea",
        required: false,
        placeholder: "Observaciones adicionales sobre la casa",
        rows: 3,
      },
    ],
    [calles, copropietarios]
  );

  // Cargar datos de calles y copropietarios
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const callesData = await getCalles({ pageSize: 100 });
        setCalles(callesData.results || []);

        const copropData = await getCopropietarios({ pageSize: 100 });
        setCopropietarios(copropData.results || []);
      } catch (error) {
        console.error("Error al cargar opciones:", error);
        setMessage({
          type: "error",
          text: "Error al cargar las opciones del formulario.",
        });
      }
    };
    loadOptions();
  }, []);

  // Cargar datos de la casa si estamos editando
  useEffect(() => {
    const loadCasaData = async () => {
      if (!isEditing) return;

      setLoading(true);
      try {
        const casa = await getCasaById(id);
        console.log("🏠 Casa cargada:", casa);

        setOriginalData(casa);

        // Transformar los datos para el formulario
        const formDataTransformed = {
          ...casa,
          id_calle: casa.id_calle?.id || casa.id_calle,
          id_dueño_casa:
            casa.id_dueño_casa?.usuario?.ci || casa.id_dueño_casa || "",
          ocupada_display: casa.ocupada ? "Ocupada" : "Disponible",
        };

        console.log("📊 Datos transformados:", formDataTransformed);
        setFormData(formDataTransformed);
      } catch (error) {
        console.error("Error al cargar casa:", error);
        setMessage({
          type: "error",
          text: "No se pudieron cargar los datos de la casa.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCasaData();
  }, [id, isEditing]);

  // Cambio de campos
  const handleFieldChange = (key, value) => {
    console.log(`🔄 Campo cambiado: ${key} =`, value);

    const newData = { ...formData, [key]: value };

    // Actualizar el estado display cuando cambia el dueño
    if (key === "id_dueño_casa") {
      const nuevoEstado = value ? "Ocupada" : "Disponible";
      console.log(`🏠 Actualizando estado a: ${nuevoEstado}`);
      newData.ocupada_display = nuevoEstado;
    }

    console.log("📊 Nuevos datos del formulario:", newData);
    setFormData(newData);
  };

  // Validación personalizada antes de enviar
  const validateForm = (data) => {
    const errors = {};

    // Validar área positiva
    if (data.ancho && data.largo) {
      const area = data.ancho * data.largo;
      if (area <= 0) {
        errors.ancho = "El área resultante debe ser mayor a 0";
        errors.largo = "El área resultante debe ser mayor a 0";
      }
    }

    // Validar habitaciones
    if (data.nro_habitaciones !== undefined && data.nro_habitaciones < 1) {
      errors.nro_habitaciones = "Debe tener al menos 1 habitación";
    }

    return errors;
  };

  // Guardar (crear/editar)
  const handleSubmit = async (submittedData) => {
    console.log("📋 Datos del formulario recibidos:", submittedData);

    setLoading(true);
    setMessage(null);

    try {
      // Validar el formulario
      const errors = validateForm(submittedData);
      if (Object.keys(errors).length > 0) {
        setMessage({
          type: "error",
          text: "Por favor corrija los errores del formulario.",
          errors: errors,
        });
        setLoading(false);
        return;
      }

      // DETERMINAR ESTADO AUTOMÁTICAMENTE: si tiene dueño → ocupada, si no → disponible
      const tieneDueño = Boolean(
        submittedData.id_dueño_casa && submittedData.id_dueño_casa !== ""
      );

      console.log("👤 Tiene dueño:", tieneDueño);
      console.log("🔍 Dueño seleccionado:", submittedData.id_dueño_casa);

      // PREPARAR DATOS
      const apiData = {
        nro: parseInt(submittedData.nro),
        id_calle: parseInt(submittedData.id_calle),
        ocupada: tieneDueño, // ← ESTADO AUTOMÁTICO
        nro_habitaciones: parseInt(submittedData.nro_habitaciones),
        nro_baños: parseInt(submittedData.nro_baños),
        ancho: parseFloat(submittedData.ancho),
        largo: parseFloat(submittedData.largo),
        color: submittedData.color || "",
        observaciones: submittedData.observaciones || "",
        fecha_construccion: submittedData.fecha_construccion || null,
      };

      // Solo incluir id_dueño_casa si tiene dueño
      if (tieneDueño) {
        apiData.id_dueño_casa = submittedData.id_dueño_casa;
      } else {
        apiData.id_dueño_casa = null;
      }

      console.log("🚀 Datos para API:", apiData);

      if (isEditing) {
        await updateCasa(id, apiData);
        setMessage({ type: "success", text: "Casa actualizada con éxito" });
      } else {
        await createCasa(apiData);
        setMessage({ type: "success", text: "Casa creada con éxito" });
      }

      setTimeout(() => navigate("/adminlayout/gestionar-casas"), 2000);
    } catch (error) {
      console.error("Error al guardar casa:", error);

      if (
        error.message &&
        error.message.includes("2 veces en la misma calle")
      ) {
        setMessage({
          type: "error",
          text: "Ya existe una casa con ese número en la misma calle. Por favor, use un número diferente.",
        });
      } else {
        setMessage({
          type: "error",
          text:
            error.message ||
            (isEditing
              ? "Error al actualizar la casa"
              : "Error al crear la casa"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form
        title={isEditing ? "Editar Casa" : "Crear Nueva Casa"}
        fields={casaFields}
        initialData={formData}
        onSubmit={handleSubmit}
        backUrl="/adminlayout/gestionar-casas"
        loading={loading}
        message={message}
        onMessageClose={() => setMessage(null)}
        submitText={isEditing ? "Actualizar Casa" : "Crear Casa"}
        mode={isEditing ? "edit" : "create"}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}
