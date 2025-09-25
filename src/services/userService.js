import apiClient from "./api";

/**
 * Obtiene una lista paginada y filtrada de usuarios.
 * @param {object} params - Los parámetros para la query.
 * @param {number} params.page - Número de página.
 * @param {number} params.pageSize - Items por página.
 * @param {string} params.search - Término de búsqueda.
 * @param {string} params.ordering - Campo de ordenamiento.
 * @param {Record<string, any>} params.filters - Objeto con los filtros.
 * @returns {Promise<object>} - La respuesta de la API (pagination y results).
 */
export const getUsers = async (params = {}) => {
  const { page, pageSize, search, ordering, filters } = params;

  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page);
  if (pageSize) queryParams.append("page_size", pageSize);
  if (search) queryParams.append("search", search);
  if (ordering) queryParams.append("ordering", ordering);

  // Añadir filtros dinámicamente
  if (filters) {
    for (const key in filters) {
      if (filters[key]) {
        // Solo añade si el filtro tiene un valor
        queryParams.append(key, filters[key]);
      }
    }
  }

  try {
    const response = await apiClient.get(
      `/usuarios/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "No se pudieron obtener los usuarios."
    );
  }
};

/**
 * Obtiene un usuario específico por su ID.
 */
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching user ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo obtener el usuario."
    );
  }
};

/**
 * Crea un nuevo usuario.
 */
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/usuarios/", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo crear el usuario."
    );
  }
};

/**
 * Actualiza un usuario existente.
 */
export const updateUser = async (id, userData) => {
  // Si la contraseña está vacía, no la enviamos en la petición PATCH
  const dataToSend = { ...userData };
  if (!dataToSend.password) {
    delete dataToSend.password;
  }

  try {
    // Usamos PATCH en lugar de PUT para permitir actualizaciones parciales
    const response = await apiClient.patch(`/usuarios/${id}/`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating user ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo actualizar el usuario."
    );
  }
};

/**
 * Elimina un usuario.
 */
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Error al eliminar usuario"
    );
  }
};

/**
 * Crea un usuario con su modelo específico según el tipo
 */
export const createSpecificUser = async (userData, userType) => {
  try {
    // Validar correo antes de enviar
    if (!userData.correo || !isValidEmail(userData.correo)) {
      throw new Error("Por favor ingrese un correo electrónico válido.");
    }

    // Armamos el objeto anidado tal como espera el serializer
    const requestData = {
      usuario: {
        ci: userData.ci,
        first_name: userData.first_name,
        last_name: userData.last_name,
        correo: userData.correo.trim().toLowerCase(),
        password: userData.password,
        telefono: userData.telefono,
        sexo: userData.sexo,
        fecha_nacimiento: userData.fecha_nacimiento,
        tipo: userType,
      },
    };

    // Para Trabajador y Guardia, añadimos los campos adicionales al nivel superior
    const additionalFields = {};
    if (userType === "Trabajador") {
      additionalFields.tipo = userData.tipo_trabajador || "General";
    }
    if (userType === "Guardia") {
      additionalFields.turno = userData.turno || "Diurno";
    }

    let endpoint = "";
    switch (userType) {
      case "Copropietario":
        endpoint = "/copropietarios/";
        break;
      case "Administrador":
        endpoint = "/administradores/";
        break;
      case "Residente":
        endpoint = "/residentes/";
        break;
      case "Trabajador":
        endpoint = "/trabajadores/";
        Object.assign(requestData, additionalFields);
        break;
      case "Guardia":
        endpoint = "/guardias/";
        Object.assign(requestData, additionalFields);
        break;
      default:
        throw new Error(`Tipo de usuario no soportado: ${userType}`);
    }

    console.log("👤 Creando usuario específico en", endpoint, requestData);
    const response = await apiClient.post(endpoint, requestData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating specific user:", error.response?.data);
    const errorMessage = getErrorMessage(error, userType);
    throw new Error(errorMessage);
  }
};

/**
 * Crea el registro específico (Copropietario, Administrador, etc.) después de crear el Usuario
 */
export const createSpecificRecord = async (
  usuarioId,
  userType,
  additionalData = {}
) => {
  try {
    let endpoint = "";
    let requestData = {};

    switch (userType) {
      case "Copropietario":
        endpoint = "/copropietarios/";
        requestData = { usuario_id: usuarioId };
        break;
      case "Administrador":
        endpoint = "/administradores/";
        requestData = { usuario_id: usuarioId };
        break;
      case "Residente":
        endpoint = "/residentes/";
        requestData = { usuario_id: usuarioId };
        break;
      case "Trabajador":
        endpoint = "/trabajadores/";
        requestData = {
          usuario_id: usuarioId,
          tipo: additionalData.tipo_trabajador || "General",
        };
        break;
      case "Guardia":
        endpoint = "/guardias/";
        requestData = {
          usuario_id: usuarioId,
          turno: additionalData.turno || "Diurno",
        };
        break;
      default:
        return null;
    }

    console.log("📝 Creando registro específico en:", endpoint, requestData);
    const response = await apiClient.post(endpoint, requestData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creando registro específico:",
      error.response?.data
    );
    throw new Error(`No se pudo crear el registro de ${userType}`);
  }
};

/**
 * Actualiza un usuario específico
 */
export const updateSpecificUser = async (
  userId,
  userData,
  userType,
  oldUserType
) => {
  try {
    console.log(
      `🔄 Actualizando ${userType} con ID usuario: ${userId}`,
      userData
    );

    // Si el tipo de usuario cambió, manejar migración
    if (userType !== oldUserType) {
      console.log(`🔄 Cambio de tipo: ${oldUserType} -> ${userType}`);
      await updateUser(userId, { tipo: userType });
      if (["Trabajador", "Guardia"].includes(userType)) {
        await createSpecificRecord(userId, userType, userData);
      }
      return;
    }

    // 1. Primero actualizar el usuario base
    const userUpdateData = {
      ci: userData.ci,
      first_name: userData.first_name,
      last_name: userData.last_name,
      correo: userData.correo,
      fecha_nacimiento: userData.fecha_nacimiento,
      telefono: userData.telefono,
      sexo: userData.sexo,
      tipo: userData.tipo,
    };

    if (userData.password && userData.password.trim() !== "") {
      userUpdateData.password = userData.password;
    }

    await updateUser(userId, userUpdateData);

    // 2. Si tenemos specific_id, actualizar datos específicos
    if (userData.specific_id) {
      let endpoint;
      let dataToSend = {};

      switch (userType) {
        case "Trabajador":
          endpoint = `/trabajadores/${userData.specific_id}/`;
          dataToSend = { tipo: userData.tipo_trabajador };
          break;
        case "Guardia":
          endpoint = `/guardias/${userData.specific_id}/`;
          dataToSend = { turno: userData.turno };
          break;
        case "Administrador":
        case "Copropietario":
        case "Residente":
          // No necesitan actualización específica
          return;
        default:
          throw new Error(`Tipo de usuario no soportado: ${userType}`);
      }

      if (Object.keys(dataToSend).length > 0) {
        console.log(`🔧 Actualizando ${userType} en: ${endpoint}`, dataToSend);
        const response = await apiClient.patch(endpoint, dataToSend);
        console.log(`✅ ${userType} actualizado:`, response.data);
      }
    } else {
      console.log(
        `ℹ️ No hay specific_id para actualizar datos específicos de ${userType}`
      );
    }
  } catch (error) {
    console.error(`❌ Error updating ${userType}:`, error);
    throw error;
  }
};

/**
 * Migra un usuario de un tipo a otro (elimina registro antiguo, crea nuevo)
 */
export const migrateUserType = async (
  specificUserId,
  oldUserType,
  newUserType,
  userData,
  additionalData = {}
) => {
  try {
    // 1. Obtener el ID del usuario base primero
    const specificUser = await getSpecificUserById(specificUserId, oldUserType);
    const usuarioBaseId = specificUser.usuario.id;

    // 2. Eliminar registro antiguo
    if (
      oldUserType &&
      [
        "Copropietario",
        "Administrador",
        "Residente",
        "Trabajador",
        "Guardia",
      ].includes(oldUserType)
    ) {
      let oldEndpoint = "";

      switch (oldUserType) {
        case "Copropietario":
          oldEndpoint = `/copropietarios/${specificUserId}/`;
          break;
        case "Administrador":
          oldEndpoint = `/administradores/${specificUserId}/`;
          break;
        case "Residente":
          oldEndpoint = `/residentes/${specificUserId}/`;
          break;
        case "Trabajador":
          oldEndpoint = `/trabajadores/${specificUserId}/`;
          break;
        case "Guardia":
          oldEndpoint = `/guardias/${specificUserId}/`;
          break;
      }

      if (oldEndpoint) {
        console.log("🗑️ Eliminando registro antiguo:", oldEndpoint);
        await apiClient.delete(oldEndpoint);
      }
    }

    // 3. Actualizar el tipo en el usuario base
    await updateUser(usuarioBaseId, { tipo: newUserType });

    // 4. Crear nuevo registro específico
    if (
      [
        "Copropietario",
        "Administrador",
        "Residente",
        "Trabajador",
        "Guardia",
      ].includes(newUserType)
    ) {
      await createSpecificRecord(usuarioBaseId, newUserType, userData);
    }

    console.log("✅ Migración completada de", oldUserType, "a", newUserType);
  } catch (error) {
    console.error("❌ Error en migración:", error.response?.data);
    throw new Error(
      `No se pudo migrar el usuario de ${oldUserType} a ${newUserType}`
    );
  }
};

/**
 * Obtiene un usuario específico por tipo e ID
 */
export const getSpecificUserById = async (specificId, userType) => {
  try {
    let endpoint;

    switch (userType) {
      case "Trabajador":
        endpoint = `/trabajadores/${specificId}/`;
        break;
      case "Guardia":
        endpoint = `/guardias/${specificId}/`;
        break;
      case "Administrador":
        endpoint = `/administradores/${specificId}/`;
        break;
      case "Copropietario":
        endpoint = `/copropietarios/${specificId}/`;
        break;
      case "Residente":
        endpoint = `/residentes/${specificId}/`;
        break;
      default:
        throw new Error(`Tipo de usuario no soportado: ${userType}`);
    }

    const response = await apiClient.get(endpoint);
    const specificData = response.data;

    console.log(`📋 Datos específicos de ${userType}:`, specificData);

    // Combinar datos del usuario con datos específicos
    const combinedData = {
      ...specificData.usuario, // Datos básicos del usuario
      specific_id: specificId, // ← ID del registro específico
      id: specificData.usuario.id, // ← ID del usuario base
    };

    // Agregar campos específicos si existen
    if (userType === "Trabajador" && specificData.tipo) {
      combinedData.tipo_trabajador = specificData.tipo;
    }
    if (userType === "Guardia" && specificData.turno) {
      combinedData.turno = specificData.turno;
    }

    return combinedData;
  } catch (error) {
    console.error(`Error al cargar ${userType}:`, error);
    throw error;
  }
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getErrorMessage = (error, userType) => {
  if (error.response?.data) {
    // Buscar mensajes de error específicos
    if (error.response.data.correo) {
      return error.response.data.correo[0];
    }
    if (error.response.data.detail) {
      return error.response.data.detail;
    }
    if (typeof error.response.data === "string") {
      return error.response.data;
    }
    // Para errores de validación de Django
    if (typeof error.response.data === "object") {
      const firstError = Object.values(error.response.data)[0];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      return firstError || `No se pudo procesar el ${userType.toLowerCase()}.`;
    }
  }
  return error.message || `No se pudo procesar el ${userType.toLowerCase()}.`;
};
