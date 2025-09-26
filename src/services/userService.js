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

    const response = await apiClient.post(endpoint, requestData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating specific user:", error.response?.data);
    const errorMessage = getErrorMessage(error, userType);
    throw new Error(errorMessage);
  }
};

/**
 * Crea el registro específico (Copropietario, Administrador, etc.)
 * Se usa tanto para creación como para migración.
 */
export const createSpecificRecord = async (
  usuarioId,
  userType,
  additionalData = {}
) => {
  let endpoint = "";
  // Ya no necesitamos primaryKeyField
  let requestData = {};

  // ASIGNA EL ID DEL USUARIO. ESTA ES LA PARTE CLAVE.
  // El backend siempre espera el campo 'usuario' para la relación.
  requestData.usuario = usuarioId;

  switch (userType) {
    case "Copropietario":
      endpoint = "/copropietarios/";
      // No se necesita nada más
      break;
    case "Administrador":
      endpoint = "/administradores/";
      // No se necesita nada más
      break;
    case "Residente":
      endpoint = "/residentes/";
      // No se necesita nada más
      break;
    case "Trabajador":
      endpoint = "/trabajadores/";
      // Añadir campos adicionales para este tipo
      requestData.tipo = additionalData.tipo_trabajador || "General";
      break;
    case "Guardia":
      endpoint = "/guardias/";
      // Añadir campos adicionales para este tipo
      requestData.turno = additionalData.turno || "Diurno";
      break;
    default:
      console.warn(
        `El tipo de usuario ${userType} no requiere un registro específico.`
      );
      return null;
  }

  // Ya no necesitas esta línea: requestData[primaryKeyField] = usuarioId;

  try {
    const response = await apiClient.post(endpoint, requestData);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error creando registro de ${userType}:`,
      error.response?.data
    );
    throw new Error(`No se pudo crear el nuevo rol de ${userType}.`);
  }
};

/**
 * Elimina un registro de una tabla específica (Guardia, Trabajador, etc.)
 * basado en el ID del usuario.
 * @param {string} userId - El ID del usuario, que también es la PK del registro específico.
 * @param {string} userType - El tipo de usuario a eliminar (ej: "Copropietario").
 */
const deleteSpecificRecord = async (userId, userType) => {
  let endpoint = "";
  switch (userType) {
    case "Administrador":
      endpoint = `/administradores/${userId}/`;
      break;
    case "Copropietario":
      endpoint = `/copropietarios/${userId}/`;
      break;
    case "Residente":
      endpoint = `/residentes/${userId}/`;
      break;
    case "Trabajador":
      endpoint = `/trabajadores/${userId}/`;
      break;
    case "Guardia":
      endpoint = `/guardias/${userId}/`;
      break;
    default:
      console.warn(
        `No hay registro específico que eliminar para el tipo: ${userType}`
      );
      return;
  }

  try {
    await apiClient.delete(endpoint);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Si el registro no existía, no es un error crítico.
      console.warn(
        `No se encontró registro antiguo de ${userType} para eliminar. Se continúa con la migración.`
      );
    } else {
      console.error(
        `❌ Falló la eliminación del registro antiguo de ${userType}:`,
        error.response?.data
      );
      throw new Error(`No se pudo eliminar el rol anterior de ${userType}.`);
    }
  }
};

export const updateSpecificUser = async (
  userId,
  userData,
  newUserType,
  oldUserType
) => {
  const typeChanged = newUserType !== oldUserType;

  const baseUserData = {
    ci: userData.ci,
    first_name: userData.first_name,
    last_name: userData.last_name,
    correo: userData.correo,
    fecha_nacimiento: userData.fecha_nacimiento,
    telefono: userData.telefono,
    sexo: userData.sexo,
    tipo: newUserType,
  };

  if (userData.password && userData.password.trim() !== "") {
    baseUserData.password = userData.password;
  }

  if (typeChanged) {
    // --- LÓGICA DE MIGRACIÓN ---
    await deleteSpecificRecord(userId, oldUserType);
    await updateUser(userId, baseUserData);
    await createSpecificRecord(userId, newUserType, userData);
  } else {
    // --- LÓGICA DE ACTUALIZACIÓN ESTÁNDAR ---
    await updateUser(userId, baseUserData);

    let specificEndpoint = "";
    let specificPayload = {};

    if (newUserType === "Trabajador") {
      specificEndpoint = `/trabajadores/${userId}/`;
      specificPayload = { tipo: userData.tipo_trabajador };
    } else if (newUserType === "Guardia") {
      specificEndpoint = `/guardias/${userId}/`;
      specificPayload = { turno: userData.turno };
    }

    if (specificEndpoint) {
      try {
        await apiClient.patch(specificEndpoint, specificPayload);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(
            `Registro específico para ${newUserType} no encontrado, se creará uno nuevo.`
          );
          await createSpecificRecord(userId, newUserType, userData);
        } else {
          throw error;
        }
      }
    }
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
