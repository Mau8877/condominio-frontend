import apiClient from "./api";

/**
 * Obtiene una lista paginada y filtrada de calles.
 * @param {object} params - Los parámetros para la query.
 * @param {number} params.page - Número de página.
 * @param {number} params.pageSize - Items por página.
 * @param {string} params.search - Término de búsqueda.
 * @param {string} params.ordering - Campo de ordenamiento.
 * @param {Record<string, any>} params.filters - Objeto con los filtros.
 * @returns {Promise<object>} - La respuesta de la API (pagination y results).
 */

export const getCalles = async (params = {}) => {
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
      `/calles/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "No se pudieron obtener las calles."
    );
  }
};

export const getCalleById = async (id) => {
  try {
    const response = await apiClient.get(`/calles/${id}/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching calle ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo obtener la calle."
    );
  }
};

/**
 * Crea una nueva calle.
 */
export const createCalle = async (calleData) => {
  try {
    const response = await apiClient.post("/calles/", calleData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating calle:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo crear la calle."
    );
  }
};

/**
 * Actualiza una calle existente.
 */
export const updateCalle = async (id, calleData) => {
  // Si la contraseña está vacía, no la enviamos en la petición PATCH
  const dataToSend = { ...calleData };
  if (!dataToSend.password) {
    delete dataToSend.password;
  }

  try {
    // Usamos PATCH en lugar de PUT para permitir actualizaciones parciales
    const response = await apiClient.patch(`/calles/${id}/`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating calle ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo actualizar la calle."
    );
  }
};

/**
 * Elimina una calle
 */
export const deleteCalle = async (id) => {
  try {
    const response = await apiClient.delete(`/calles/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Error al eliminar usuario"
    );
  }
};