import React from 'react';
import DataTable from './DataTable';
import Loader from './Loader';
import Message from './Message';

const DataGrid = ({
  loading,
  error,
  data,
  columns,
  onEdit,
  onDelete,
  sortConfig,
  onSort,
}) => {
  if (loading) {
    return <Loader variant="subtle" text="Cargando datos..." />;
  }

  if (error) {
    return <Message type="error" message={`Error al cargar: ${error}`} />;
  }

  if (data.length === 0) {
    return <Message type="info" message="No se encontraron resultados para su búsqueda." closable={false} />;
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      sortConfig={sortConfig}
      onSort={onSort}
    />
  );
};

export default DataGrid;