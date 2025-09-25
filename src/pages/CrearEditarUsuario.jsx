import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../components/Form";
import {
  getUserById,
  updateUser,
  createUser,
  createSpecificUser,
  updateSpecificUser,
  getSpecificUserById,
  createSpecificRecord,
} from "../services/userService";

// Campos base comunes a todos los usuarios
const getBaseUserFields = (selectedUserType) => {
  const baseFields = [
    { key: "ci", label: "Cédula de Identidad", type: "text", required: true },
    { key: "first_name", label: "Nombres", type: "text", required: true },
    { key: "last_name", label: "Apellidos", type: "text", required: true },
    { key: "correo", label: "Email", type: "email", required: true },
    {
      key: "password",
      label: "Contraseña",
      type: "password",
      required: true,
      hideInEdit: true,
    },
    {
      key: "fecha_nacimiento",
      label: "Fecha de Nacimiento",
      type: "date",
      required: true,
    },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    {
      key: "sexo",
      label: "Sexo",
      type: "select",
      required: true,
      options: [
        { value: "M", label: "Masculino" },
        { value: "F", label: "Femenino" },
      ],
    },
  ];

  const tipoField = {
    key: "tipo",
    label: "Tipo de Usuario",
    type: "select",
    required: true,
    options: [
      { value: "Administrador", label: "Administrador" },
      { value: "Copropietario", label: "Copropietario" },
      { value: "Residente", label: "Residente" },
      { value: "Guardia", label: "Guardia" },
      { value: "Trabajador", label: "Trabajador" },
    ],
  };

  if (selectedUserType && selectedUserType !== "") {
    tipoField.disabled = true;
    tipoField.value = selectedUserType;
  }

  baseFields.push(tipoField);
  return baseFields;
};

// Campos adicionales específicos por tipo de usuario
const getSpecificFields = (userType) => {
  switch (userType) {
    case "Trabajador":
      return [
        {
          key: "tipo_trabajador",
          label: "Tipo de Trabajo",
          type: "select",
          required: true,
          options: [
            { value: "Jardinería", label: "Jardinería" },
            { value: "Limpieza", label: "Limpieza" },
            { value: "Mantenimiento", label: "Mantenimiento" },
            { value: "Seguridad", label: "Seguridad" },
            { value: "Administrativo", label: "Administrativo" },
          ],
        },
      ];
    case "Guardia":
      return [
        {
          key: "turno",
          label: "Turno",
          type: "select",
          required: true,
          options: [
            { value: "Diurno", label: "Diurno" },
            { value: "Nocturno", label: "Nocturno" },
            { value: "Rotativo", label: "Rotativo" },
          ],
        },
      ];
    default:
      return [];
  }
};

const CrearEditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedUserType, setSelectedUserType] = useState("");

  // Cargar datos en modo edición - VERSIÓN CORREGIDA Y SIMPLIFICADA
  useEffect(() => {
    const loadUserData = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          // 1. Primero obtener los datos básicos del usuario
          const baseUser = await getUserById(id);
          const userType = baseUser.tipo;
          setSelectedUserType(userType);

          console.log("📋 Datos básicos cargados:", baseUser);
          console.log("🔍 Tipo de usuario:", userType);

          // 2. Para tipos con datos específicos, obtener el ID específico primero
          if (
            [
              "Trabajador",
              "Guardia",
              "Administrador",
              "Copropietario",
              "Residente",
            ].includes(userType)
          ) {
            try {
              // Obtener el ID específico del registro
              const specificId = await getSpecificIdByUserId(id, userType);
              console.log("🔑 ID específico encontrado:", specificId);

              // Luego obtener los datos completos con el ID específico
              const specificData = await getSpecificUserById(
                specificId,
                userType
              );
              console.log("📋 Datos específicos cargados:", specificData);

              // Combinar datos
              const combinedData = {
                ...baseUser,
                ...specificData,
              };

              setFormData(combinedData);
            } catch (specificError) {
              console.warn(
                "No se pudieron cargar datos específicos, usando datos básicos:",
                specificError
              );
              setFormData(baseUser);
            }
          } else {
            // Para tipos sin datos específicos
            setFormData(baseUser);
          }
        } catch (error) {
          console.error("Error al cargar usuario:", error);
          setMessage({
            type: "error",
            text: "No se pudieron cargar los datos del usuario.",
            closable: true,
          });
        } finally {
          setLoading(false);
        }
      } else {
        // Modo creación
        setSelectedUserType("Residente");
        setFormData({ tipo: "Residente" });
      }
    };

    loadUserData();
  }, [id, isEditing]);

  // Configuración dinámica de campos
  const userFields = useMemo(() => {
    const baseFields = getBaseUserFields(selectedUserType);
    const specificFields = getSpecificFields(selectedUserType);

    let allFields = [...baseFields];
    const tipoIndex = allFields.findIndex((field) => field.key === "tipo");

    if (tipoIndex !== -1 && specificFields.length > 0) {
      allFields.splice(tipoIndex + 1, 0, ...specificFields);
    }

    // Ajustar campos en modo edición
    if (isEditing) {
      allFields = allFields
        .map((field) => {
          if (field.key === "password") {
            return {
              ...field,
              label: "Nueva Contraseña (opcional)",
              required: false,
              placeholder: "Dejar en blanco para no cambiar",
            };
          }
          return field;
        })
        .filter((field) => !field.hideInEdit);
    }

    return allFields;
  }, [isEditing, selectedUserType]);

  // Manejadores
  const handleUserTypeChange = (type) => {
    setSelectedUserType(type);
    setFormData((prev) => ({ ...prev, tipo: type }));
  };

  const handleFieldChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));

    if (key === "tipo") {
      handleUserTypeChange(value);
    }
  };

  const handleSubmit = async (submittedData) => {
    setLoading(true);
    setMessage(null);

    try {
      const userType = submittedData.tipo || selectedUserType;
      const successText = isEditing
        ? "Usuario actualizado con éxito"
        : "Usuario creado con éxito";

      if (isEditing) {
        const oldUserType = formData.tipo;

        if (
          [
            "Administrador",
            "Copropietario",
            "Residente",
            "Trabajador",
            "Guardia",
          ].includes(userType)
        ) {
          await updateSpecificUser(id, submittedData, userType, oldUserType);
        } else {
          if (submittedData.password === "") {
            delete submittedData.password;
          }
          await updateUser(id, submittedData);
        }
      } else {
        if (
          [
            "Administrador",
            "Copropietario",
            "Residente",
            "Trabajador",
            "Guardia",
          ].includes(userType)
        ) {
          await createSpecificUser(submittedData, userType);
        } else {
          const userResponse = await createUser(submittedData);
          if (userType !== "Usuario") {
            await createSpecificRecord(
              userResponse.id,
              userType,
              submittedData
            );
          }
        }
      }

      setMessage({ type: "success", text: successText, duration: 3000 });
      setTimeout(() => navigate("/adminlayout/gestionar-usuario"), 2000);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      const errorText = isEditing
        ? "Error al actualizar el usuario"
        : "Error al crear el usuario";
      setMessage({
        type: "error",
        text: `${errorText}: ${error.message}`,
        closable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("🎯 Datos actuales del formulario:", formData);
  console.log("📝 Campos del formulario:", userFields);

  return (
    <Form
      title={isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
      fields={userFields}
      initialData={formData}
      onSubmit={handleSubmit}
      backUrl="/adminlayout/gestionar-usuario"
      loading={loading}
      message={message}
      onMessageClose={() => setMessage(null)}
      submitText={isEditing ? "Actualizar Usuario" : "Crear Usuario"}
      mode={isEditing ? "edit" : "create"}
      onFieldChange={handleFieldChange}
    />
  );
};

export default CrearEditarUsuario;
