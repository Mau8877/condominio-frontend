import React, { useState, useEffect } from 'react'; // <-- Importar useEffect
import GestionarList from '../components/GestionarList';
import GestionModal from '../components/GestionModal';
import ConfirmModal from '../components/ConfirmModal';
import MessageModal from '../components/MessageModal';
import "../styles/GestionarUsuario.css";

export default function GestionarUsuario() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [refreshKey, setRefreshKey] = useState(0);

  // ¡Mejora! Guardar los roles para mostrarlos en un dropdown
  const [roles, setRoles] = useState([]); 

  // Cargar los roles cuando el componente se monta
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URL}api/roles/`, { credentials: 'include' });
        const data = await response.json();
        // Formatear para el componente del modal
        const options = data.map(rol => ({ value: rol.id, label: rol.nombre }));
        setRoles(options);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [API_URL]);


  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: '60px' }, // <-- Usamos el ID real
    { key: 'ci', label: 'CI', sortable: true, width: '100px' },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Correo', sortable: true },
    { key: 'rol.nombre', label: 'Rol', sortable: true },
    { key: 'is_active', label: 'Activo', sortable: true, render: value => value ? 'Sí' : 'No' }
  ];

  // Definición de campos para el modal
  const getFields = (mode) => {
    const baseFields = [
      { key: 'nombre', label: 'Nombre Completo', required: true },
      { key: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento', type: 'date', required: true },
      { key: 'sexo', label: 'Sexo', required: true, type: 'select', options: [{value: 'M', label: 'Masculino'}, {value: 'F', label: 'Femenino'}] },
      // ¡Mejora! Usamos un dropdown para los roles
      { key: 'rol', label: 'Rol', required: true, type: 'select', options: roles },
      { key: 'is_active', label: 'Activo', type: 'checkbox' }
    ];
    if (mode === 'add') {
      return [
        { key: 'ci', label: 'CI', required: true}, // <-- Añadir CI al crear
        ...baseFields,
        { key: 'password', label: 'Contraseña', type: 'password', required: true },
        { key: 'password2', label: 'Confirmar Contraseña', type: 'password', required: true }
      ];
    }
    return baseFields;
  };


  const showMessage = (msg) => {
    setMessage(msg);
    setIsMessageModalOpen(true);
  };

  const handleEdit = (usuario) => {
    // Al editar, el valor del rol debe ser solo el ID
    const usuarioParaEditar = { ...usuario, rol: usuario.rol.id };
    setEditingUsuario(usuarioParaEditar);
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!usuarioToDelete) return;

    try {
      // 3. CAMBIO CRÍTICO: Usamos el ID del usuario, no el CI
      const response = await fetch(`${API_URL}api/usuarios/${usuarioToDelete.id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al eliminar el usuario');
      showMessage('Usuario eliminado correctamente.');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      showMessage(`Error: ${error.message}`);
    } finally {
      setIsConfirmModalOpen(false);
      setUsuarioToDelete(null);
    }
  };
  
  const handleAdd = () => {
    setEditingUsuario(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      let url = `${API_URL}api/usuarios/`;
      let method = 'POST';
      let payload = { ...formData };

      // Al crear, el backend espera 'rol_nombre', no 'rol' (ID)
      if (modalMode === 'add') {
        const selectedRol = roles.find(r => r.value === parseInt(payload.rol));
        if (selectedRol) {
          payload.rol_nombre = selectedRol.label;
          delete payload.rol; // Quitamos el ID del rol para no confundir al serializer
        }
      }

      if (modalMode === 'edit') {
        // 4. CAMBIO CRÍTICO: Usamos el ID del usuario para la URL de edición
        url = `${API_URL}api/usuarios/${editingUsuario.id}/`;
        method = 'PATCH'; // Usar PATCH para actualizaciones parciales es mejor
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const responseData = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(responseData));

      showMessage(modalMode === 'add' ? 'Usuario creado exitosamente.' : 'Usuario actualizado correctamente.');
      setIsModalOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      showMessage(`Error: ${error.message}`);
    }
  };


  return (
    <div className="gestionar-medico-container">
      <GestionarList
        apiUrl={`${API_URL}api/usuarios/`}
        title="Gestión de Usuarios"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAdd={handleAdd}
        refreshTrigger={refreshKey}
      />
      <GestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingUsuario}
        fields={getFields(modalMode)}
        title={modalMode === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario'}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar eliminación"
        message={usuarioToDelete ? `¿Estás seguro de eliminar a ${usuarioToDelete.nombre}?` : ''}
      />
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        message={message}
      />
    </div>
  );
}