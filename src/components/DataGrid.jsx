import React, { useState, useEffect, useMemo } from 'react';
import DataTable from './DataTable';
import Loader from './Loader';
import Message from './Message';
import { sortData } from '../utils/dataUtils';

/**
 * Contenedor de datos que maneja la obtención, carga, errores y ordenamiento.
 * @param {string} apiUrl - Endpoint para obtener los datos.
 * @param {Array<object>} columns - Definición de las columnas.
 * @param {function} onEdit - Callback para editar.
 * @param {function} onDelete - Callback para eliminar.
 */
const DataGrid = ({ apiUrl, columns, onEdit, onDelete }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
      // Al tercer clic, se quita el ordenamiento
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };
  
  // Usamos useMemo para evitar re-ordenar en cada renderizado
  const sortedData = useMemo(() => sortData(data, sortConfig), [data, sortConfig]);

  if (loading) {
    return <Loader variant="subtle" text="Cargando datos..." />;
  }

  if (error) {
    return <Message type="error" message={`Error al cargar: ${error}`} />;
  }

  if (data.length === 0) {
    return <Message type="info" message="No se encontraron datos." closable={false}/>;
  }

  return (
    <DataTable 
      data={sortedData} 
      columns={columns} 
      onEdit={onEdit} 
      onDelete={onDelete}
      sortConfig={sortConfig}
      onSort={handleSort}
    />
  );
};

export default DataGrid;