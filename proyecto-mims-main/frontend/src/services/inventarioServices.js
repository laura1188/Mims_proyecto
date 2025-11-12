// src/services/inventarioServices.js
import api from "./api.js";

// ✅ Catálogo público (sin autenticación)
export const getCatalogoPublico = () => api.get("/inventario/catalogo/");

// ✅ Categorías
export const getCategorias = () => api.get("/inventario/categorias/");

// ✅ Medicamentos (CRUD protegido)
export const getMedicamentos = () => api.get("/inventario/medicamentos/");
export const crearMedicamento = (data) => api.post("/inventario/medicamentos/", data);
export const actualizarMedicamento = (id, data) => api.put(`/inventario/medicamentos/${id}/`, data);
export const eliminarMedicamento = (id) => api.delete(`/inventario/medicamentos/${id}/`);