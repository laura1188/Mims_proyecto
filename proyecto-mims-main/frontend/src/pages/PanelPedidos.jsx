import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, User, MapPin, Calendar, ClipboardList } from "lucide-react";

const PanelPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/pedidos/");

        // Filtrar detalles inválidos (tu lógica de heno)
        const pedidosProcesados = res.data.map((pedido) => ({
          ...pedido,
          detalles: pedido.detalles.filter((detalle) => {
            if (!detalle.medicamento || !detalle.medicamento.nombre) return false;
            return !detalle.medicamento.nombre.toLowerCase().includes("heno");
          }),
        }));

        setPedidos(pedidosProcesados);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
        setError("Error al cargar los pedidos. Inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Cargando pedidos...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 mt-4 font-semibold">{error}</div>;
  }

  const pedidosValidos = pedidos.filter((p) => p.detalles.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
        <ClipboardList className="inline-block mr-2" />
        Panel de Pedidos
      </h2>

      {pedidosValidos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No hay pedidos válidos.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pedidosValidos.map((pedido) => (
            <motion.div
              key={pedido.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center">
                <Package className="mr-2" /> Pedido #{pedido.id}
              </h3>

              <p className="text-gray-600 mb-1">
                <User className="inline mr-1" size={16} />
                <strong>Cliente:</strong> {pedido.cliente || "Desconocido"}
              </p>

              <p className="text-gray-600 mb-1">
                <MapPin className="inline mr-1" size={16} />
                <strong>Dirección:</strong> {pedido.direccion_entrega || "Sin dirección"}
              </p>

              <p className="text-gray-600 mb-1">
                <Calendar className="inline mr-1" size={16} />
                <strong>Fecha:</strong>{" "}
                {new Date(pedido.fecha_creacion).toLocaleString()}
              </p>

              <p className="text-gray-600 mb-3">
                <strong>Estado:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-sm font-medium ${
                    pedido.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : pedido.estado === "enviado"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {pedido.estado}
                </span>
              </p>

              <p className="text-gray-600 mb-3">
                <strong>Observaciones:</strong> {pedido.observaciones || "Ninguna"}
              </p>

              <div className="border-t pt-2">
                <p className="font-semibold text-gray-800 mb-2">Detalles del pedido:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {pedido.detalles.map((detalle) => (
                    <li key={detalle.id}>
                      {detalle.medicamento?.nombre || "Producto desconocido"} —{" "}
                      <span className="font-medium">Cantidad: {detalle.cantidad}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PanelPedidos;
