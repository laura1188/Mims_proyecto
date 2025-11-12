import { useEffect, useState } from "react";
import axios from "axios";

export default function Mensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  });

  const apiUrl = "http://127.0.0.1:8000/api/mensajes/";

  // 🔹 Obtener todos los mensajes
  const cargarMensajes = async () => {
    const res = await axios.get(apiUrl);
    setMensajes(res.data);
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  // 🔹 Manejar los cambios del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Crear o actualizar un mensaje
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.id) {
      await axios.put(`${apiUrl}${formData.id}/`, formData);
    } else {
      await axios.post(apiUrl, formData);
    }
    setFormData({ id: null, nombre: "", correo: "", asunto: "", mensaje: "" });
    cargarMensajes();
  };

  // 🔹 Editar un mensaje existente
  const handleEdit = (mensaje) => {
    setFormData(mensaje);
  };

  // 🔹 Eliminar un mensaje
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este mensaje?")) {
      await axios.delete(`${apiUrl}${id}/`);
      cargarMensajes();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Mensajes</h2>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">
          {formData.id ? "Editar Mensaje" : "Nuevo Mensaje"}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="border p-2 rounded"
            required
          />
          <input
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Correo"
            className="border p-2 rounded"
            required
          />
          <input
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            placeholder="Asunto"
            className="border p-2 rounded col-span-2"
            required
          />
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Mensaje"
            className="border p-2 rounded col-span-2"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          {formData.id ? "Actualizar" : "Enviar"}
        </button>
      </form>

      {/* TABLA DE MENSAJES */}
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Asunto</th>
            <th className="border p-2">Mensaje</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mensajes.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="border p-2">{m.nombre}</td>
              <td className="border p-2">{m.correo}</td>
              <td className="border p-2">{m.asunto}</td>
              <td className="border p-2">{m.mensaje}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
