import apiClient from "./api";

/**
 * Obtiene una lista paginada y filtrada de Morosidad.
 * @param {object} params - Los parámetros para la query.
 * @param {number} params.page - Número de página.
 * @param {number} params.pageSize - Items por página.
 * @param {string} params.search - Término de búsqueda.
 * @param {string} params.ordering - Campo de ordenamiento.
 * @param {Record<string, any>} params.filters - Objeto con los filtros.
 * @returns {Promise<object>} - La respuesta de la API (pagination y results).
 */

export const getMorosidad = async (params = {}) => {
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
      `/morosidades/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "No se pudieron obtener las Morosidades."
    );
  }
};

export const getMorosidadById = async (id) => {
  try {
    const response = await apiClient.get(`/morosidades/${id}/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching morosidad ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo obtener la morosidad."
    );
  }
};