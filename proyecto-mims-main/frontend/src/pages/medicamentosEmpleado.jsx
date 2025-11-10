
import React, { useState, useEffect } from "react";
import { getMedicamentos, crearMedicamento, actualizarMedicamento, eliminarMedicamento } from "./inventarioServices";
import "../styles/medicamentos.css";

const MedicamentosEmpleado = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_venta: "",
    stock_actual: "",
  });
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    setLoading(true);
    try {
      const data = await getMedicamentos();
      setMedicamentos(data);
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nombre || !formData.precio_venta || !formData.stock_actual) {
        setMensaje("Debe completar todos los campos obligatorios.");
        return;
      }
      if (editando) {
        await actualizarMedicamento(editando, formData);
        setMensaje("Medicamento actualizado correctamente");
      } else {
        await crearMedicamento(formData);
        setMensaje("Medicamento registrado correctamente");
      }
      setFormData({ nombre: "", descripcion: "", precio_venta: "", stock_actual: "" });
      setEditando(null);
      cargarMedicamentos();
    } catch (error) {
      console.error("Error al guardar medicamento:", error);
      if (error.response && error.response.data) {
        setMensaje(JSON.stringify(error.response.data));
      } else {
        setMensaje("Ocurrió un error al guardar.");
      }
    }
  };

  const handleEditar = (med) => {
    setFormData({
      nombre: med.nombre,
      descripcion: med.descripcion || "",
      precio_venta: med.precio_venta,
      stock_actual: med.stock_actual,
    });
    setEditando(med.id);
    setMensaje("");
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar este medicamento?")) {
      try {
        await eliminarMedicamento(id);
        setMensaje("Medicamento eliminado correctamente");
        cargarMedicamentos();
      } catch (error) {
        console.error("Error al eliminar medicamento:", error);
        setMensaje("Ocurrió un error al eliminar.");
      }
    }
  };

  return (
    <div className="panel-empleado">
      <h2 className="titulo">Gestión de Medicamentos</h2>

      <form onSubmit={handleSubmit} className="formulario">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio_venta"
          placeholder="Precio"
          value={formData.precio_venta}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock_actual"
          placeholder="Stock"
          value={formData.stock_actual}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-guardar">
          {editando ? "Actualizar" : "Registrar"}
        </button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {loading ? (
        <p>Cargando medicamentos...</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla-medicamentos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map((med) => (
                <tr key={med.id}>
                  <td>{med.nombre}</td>
                  <td>{med.descripcion}</td>
                  <td>${med.precio_venta}</td>
                  <td>{med.stock_actual}</td>
                  <td>
                    <button className="btn-editar" onClick={() => handleEditar(med)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(med.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicamentosEmpleado;
