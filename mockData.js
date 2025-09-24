// Genera una gran cantidad de datos para probar la paginación y la búsqueda.
export const mockUsers = Array.from({ length: 251 }, (_, i) => ({
  id: i + 1,
  name: `Usuario ${i + 1}`,
  email: `usuario${i + 1}@condominio.com`,
  address: {
    city: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena'][i % 4],
    street: `Calle Falsa ${i + 1}`
  },
  company: {
    name: `Empresa ${String.fromCharCode(65 + (i % 26))}` // A, B, C...
  },
  phone: `555-01${(i < 100 ? '0' : '') + (i < 10 ? '0' : '') + i}`
}));