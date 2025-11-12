import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/inventario/catalogo/")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar medicamentos:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* 🔹 Sección bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-10 mt-6"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
          Bienvenido a tu tienda de confianza 💊
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto">
          Compra medicamentos de calidad con atención personalizada y entrega
          rápida.
        </p>
      </motion.div>

      {/* 🔹 Catálogo */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {productos.length > 0 ? (
          productos.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition-all"
            >
              <img
                src={p.imagen_url || "/placeholder.png"}
                alt={p.nombre}
                className="w-full h-48 object-contain mb-4 rounded-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {p.nombre}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{p.descripcion}</p>
              <p className="mt-3 text-lg font-bold text-green-600">
                ${p.precio?.toLocaleString("es-CO")}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 text-lg col-span-3">
            Cargando medicamentos...
          </p>
        )}
      </motion.div>

      {/* 🔹 Footer simple */}
      <footer className="bg-blue-700 text-white py-4 text-center mt-auto">
        © 2025 www.mims.co
      </footer>
    </div>
  );
}
