/**
 * Obtiene un valor anidado de un objeto usando una cadena de ruta.
 * @param {object} obj - El objeto del cual extraer el valor.
 * @param {string} path - La ruta al valor (ej. 'user.address.city').
 * @returns {*} - El valor encontrado o undefined.
 */
export const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * Ordena un array de objetos basado en una configuración de ordenamiento.
 * @param {Array<object>} data - El array de datos a ordenar.
 * @param {object} sortConfig - La configuración de ordenamiento { key, direction }.
 * @returns {Array<object>} - El nuevo array ordenado.
 */
export const sortData = (data, sortConfig) => {
  if (!sortConfig || !sortConfig.key) {
    return data;
  }

  const sortedData = [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return sortedData;
};