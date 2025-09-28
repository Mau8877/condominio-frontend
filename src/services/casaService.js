import apiClient from "./api";

/**
 * Obtiene una lista paginada y filtrada de casas.
 * @param {object} params - Los parámetros para la query.
 * @param {number} params.page - Número de página.
 * @param {number} params.pageSize - Items por página.
 * @param {string} params.search - Término de búsqueda.
 * @param {string} params.ordering - Campo de ordenamiento.
 * @param {Record<string, any>} params.filters - Objeto con los filtros.
 * @returns {Promise<object>} - La respuesta de la API (pagination y results).
 */
export const getCasas = async (params = {}) => {
  const { page, pageSize, search, ordering, filters } = params;

  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page);
  if (pageSize) queryParams.append("page_size", pageSize);
  if (search) queryParams.append("search", search);
  if (ordering) queryParams.append("ordering", ordering);

  // Añadir filtros dinámicamente
  if (filters) {
    for (const key in filters) {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== ""
      ) {
        queryParams.append(key, filters[key]);
      }
    }
  }

  try {
    const response = await apiClient.get(`/casas/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "No se pudieron obtener las casas."
    );
  }
};

/**
 * Obtiene una casa por su ID.
 */
export const getCasaById = async (id) => {
  try {
    const response = await apiClient.get(`/casas/${id}/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching casa ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo obtener la casa."
    );
  }
};

/**
 * Crea una nueva casa.
 */
export const createCasa = async (casaData) => {
  try {
    const response = await apiClient.post("/casas/", casaData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating casa:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo crear la casa."
    );
  }
};

/**
 * Actualiza una casa existente.
 */
export const updateCasa = async (id, casaData) => {
  try {
    const response = await apiClient.patch(`/casas/${id}/`, casaData);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating casa ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo actualizar la casa."
    );
  }
};

/**
 * Elimina una casa (soft delete).
 */
export const deleteCasa = async (id) => {
  try {
    const response = await apiClient.delete(`/casas/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Error al eliminar la casa."
    );
  }
};

/**
 * Obtiene solo las casas disponibles (no ocupadas).
 */
export const getCasasDisponibles = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);
  if (params.ordering) queryParams.append("ordering", params.ordering);

  try {
    const response = await apiClient.get(
      `/casas/disponibles/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "No se pudieron obtener las casas disponibles."
    );
  }
};

/**
 * Obtiene solo las casas ocupadas.
 */
export const getCasasOcupadas = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);
  if (params.ordering) queryParams.append("ordering", params.ordering);

  try {
    const response = await apiClient.get(
      `/casas/ocupadas/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "No se pudieron obtener las casas ocupadas."
    );
  }
};

/**
 * Gestiona la ocupación de una casa (ocupar/liberar).
 */
export const gestionarOcupacionCasa = async (id, accion, idFamilia = null) => {
  try {
    const data = {
      accion: accion, // 'ocupar' o 'liberar'
      id_familia: idFamilia,
    };

    const response = await apiClient.post(
      `/casas/${id}/gestionar_ocupacion/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error gestionando ocupación de casa ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail ||
        "No se pudo gestionar la ocupación de la casa."
    );
  }
};

/**
 * Obtiene el historial de morosidades de una casa.
 */
export const getMorosidadesCasa = async (id, params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);

  try {
    const response = await apiClient.get(
      `/casas/${id}/morosidades/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "No se pudieron obtener las morosidades de la casa."
    );
  }
};

/**
 * Obtiene estadísticas de casas.
 */
export const getEstadisticasCasas = async () => {
  try {
    const response = await apiClient.get("/casas/estadisticas/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "No se pudieron obtener las estadísticas de casas."
    );
  }
};

/**
 * Ocupa una casa con una familia específica.
 */
export const ocuparCasa = async (id, idFamilia) => {
  return await gestionarOcupacionCasa(id, "ocupar", idFamilia);
};

/**
 * Libera una casa (la marca como disponible).
 */
export const liberarCasa = async (id) => {
  return await gestionarOcupacionCasa(id, "liberar");
};

/**
 * Obtiene las casas de una calle específica.
 */
export const getCasasPorCalle = async (calleId, params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);
  if (params.ordering) queryParams.append("ordering", params.ordering);

  try {
    const response = await apiClient.get(
      `/calles/${calleId}/casas/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "No se pudieron obtener las casas de la calle."
    );
  }
};

/**
 * Obtiene una lista paginada de copropietarios
 */
export const getCopropietarios = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page);
    if (params.pageSize) queryParams.append("page_size", params.pageSize);
    if (params.search) queryParams.append("search", params.search);
    if (params.ordering) queryParams.append("ordering", params.ordering);

    const response = await apiClient.get(`/copropietarios/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "No se pudieron obtener los copropietarios."
    );
  }
};

/**
 * Obtiene un copropietario por ID
 */
export const getCopropietarioById = async (id) => {
  try {
    const response = await apiClient.get(`/copropietarios/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "No se pudo obtener el copropietario."
    );
  }
};