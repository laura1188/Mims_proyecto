import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/inventario/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===========================================
// ✅ MÉTODOS PROTEGIDOS (empleados/admin)
// ===========================================

// ✅ Obtener todos los medicamentos
//   URL real generada por el router:
//   GET /api/inventario/medicamentos/
export const getMedicamentos = async () => {
  try {
    const res = await api.get("medicamentos/");
    return res.data;
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    return [];
  }
};

// ✅ Crear medicamento
//   POST /api/inventario/medicamentos/
export const crearMedicamento = async (data) => {
  try {
    const res = await api.post("medicamentos/", data);
    return res.data;
  } catch (error) {
    console.error("Error al crear medicamento:", error);
    throw error;
  }
};

// ✅ Actualizar medicamento
//   PUT /api/inventario/medicamentos/<id>/
export const actualizarMedicamento = async (id, data) => {
  try {
    const res = await api.put(`medicamentos/${id}/`, data);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar medicamento:", error);
    throw error;
  }
};

// ✅ Eliminar medicamento
//   DELETE /api/inventario/medicamentos/<id>/
export const eliminarMedicamento = async (id) => {
  try {
    const res = await api.delete(`medicamentos/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar medicamento:", error);
    throw error;
  }
};

// ===========================================
// ✅ API PÚBLICA
// ===========================================
export const getCatalogoPublico = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/inventario/catalogo/"
    );
    return res.data;
  } catch (error) {
    console.error("Error catálogo público:", error);
    return [];
  }
};
