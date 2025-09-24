// src/services/userService.js
import apiClient from './api';

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

  if (page) queryParams.append('page', page);
  if (pageSize) queryParams.append('page_size', pageSize);
  if (search) queryParams.append('search', search);
  if (ordering) queryParams.append('ordering', ordering);

  // Añadir filtros dinámicamente
  if (filters) {
    for (const key in filters) {
      if (filters[key]) { // Solo añade si el filtro tiene un valor
        queryParams.append(key, filters[key]);
      }
    }
  }

  try {
    const response = await apiClient.get(`/usuarios/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'No se pudieron obtener los usuarios.');
  }
};

// Aquí irían las otras funciones CRUD
export const getUserById = (id) => apiClient.get(`/usuarios/${id}/`);
export const createUser = (userData) => apiClient.post('/usuarios/', userData);
export const updateUser = (id, userData) => apiClient.put(`/usuarios/${id}/`, userData);
export const deleteUser = (id) => apiClient.delete(`/usuarios/${id}/`);