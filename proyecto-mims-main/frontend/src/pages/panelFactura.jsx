import React, { useState, useEffect } from "react";
import axios from "axios";
import "./panelEmpleado.css";

function PanelEmpleado() {
  const [clientes, setClientes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [factura, setFactura] = useState({
    cliente: "",
    metodo_pago: "efectivo",
    direccion_entrega: "",
    observaciones: "",
  });
  const [detalles, setDetalles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // ========================
  // 📦 Cargar datos iniciales
  // ========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Cargar clientes
    axios
      .get("http://localhost:8000/api/usuarios/", config)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error al cargar clientes:", err));

    // Cargar medicamentos
    axios
      .get("http://localhost:8000/api/inventario/medicamentos/", config)
      .then((res) => setMedicamentos(res.data))
      .catch((err) => console.error("Error al cargar medicamentos:", err));
  }, []);

  // ========================
  // ➕ Agregar medicamento
  // ========================
  const agregarDetalle = () => {
    setDetalles([
      ...detalles,
      { medicamento_id: "", cantidad: 1, precio_unitario: 0, subtotal: 0 },
    ]);
  };

  // ========================
  // 🔄 Actualizar detalle
  // ========================
  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    if (campo === "cantidad") {
      valor = parseInt(valor) || 1; // Evitar NaN
    }
    nuevosDetalles[index][campo] = valor;

    if (campo === "medicamento_id") {
      const med = medicamentos.find((m) => m.id === parseInt(valor));
      nuevosDetalles[index].precio_unitario = med ? parseFloat(med.precio_venta) : 0;
    }

    nuevosDetalles[index].subtotal =
      nuevosDetalles[index].cantidad * nuevosDetalles[index].precio_unitario;

    setDetalles(nuevosDetalles);
  };

  // ========================
  // 🗑️ Eliminar detalle
  // ========================
  const eliminarDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  // ========================
  // 💾 Enviar factura
  // ========================
  const registrarFactura = async () => {
    if (!factura.cliente || detalles.length === 0) {
      setMensaje("Por favor seleccione cliente y agregue al menos un medicamento.");
      return;
    }

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

    // Mapear detalles para backend
    const detallesBackend = detalles.map((d) => ({
      medicamento: d.medicamento_id,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
      subtotal: d.subtotal,
    }));

    const data = { ...factura, detalles: detallesBackend, total };

    try {
      await axios.post("http://localhost:8000/api/facturacion/registrar/", data, config);
      setMensaje("✅ Factura registrada correctamente.");
      setFactura({ cliente: "", metodo_pago: "efectivo", direccion_entrega: "", observaciones: "" });
      setDetalles([]);
    } catch (error) {
      console.error("Error al registrar factura:", error);
      setMensaje("❌ Error al registrar la factura.");
    }
  };

  return (
    <div className="panel-container">
      <h2 className="titulo">🧾 Panel del Empleado - Registrar Factura</h2>

      <div className="factura-form">
        <div className="campo">
          <label>Cliente:</label>
          <select
            value={factura.cliente}
            onChange={(e) => setFactura({ ...factura, cliente: e.target.value })}
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.username}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Método de pago:</label>
          <select
            value={factura.metodo_pago}
            onChange={(e) => setFactura({ ...factura, metodo_pago: e.target.value })}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="campo">
          <label>Dirección entrega:</label>
          <input
            type="text"
            value={factura.direccion_entrega}
            onChange={(e) => setFactura({ ...factura, direccion_entrega: e.target.value })}
          />
        </div>

        <div className="campo">
          <label>Observaciones:</label>
          <textarea
            value={factura.observaciones}
            onChange={(e) => setFactura({ ...factura, observaciones: e.target.value })}
          />
        </div>
      </div>

      <h3 className="subtitulo">💊 Detalles de la Factura</h3>
      {detalles.map((detalle, index) => (
        <div key={index} className="detalle-row">
          <select
            value={detalle.medicamento_id}
            onChange={(e) => actualizarDetalle(index, "medicamento_id", e.target.value)}
          >
            <option value="">Seleccione medicamento</option>
            {medicamentos.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={detalle.cantidad}
            onChange={(e) => actualizarDetalle(index, "cantidad", e.target.value)}
          />

          <span className="precio">💲{detalle.precio_unitario.toFixed(2)}</span>
          <span className="subtotal">Subtotal: 💰{detalle.subtotal.toFixed(2)}</span>

          <button className="btn-eliminar" onClick={() => eliminarDetalle(index)}>❌</button>
        </div>
      ))}

      <button className="btn-agregar" onClick={agregarDetalle}>➕ Agregar medicamento</button>

      <div className="total">
        <strong>Total:</strong> 💵 {detalles.reduce((sum, d) => sum + d.subtotal, 0).toFixed(2)}
      </div>

      <button className="btn-registrar" onClick={registrarFactura}>
        💾 Registrar Factura
      </button>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default PanelEmpleado;
