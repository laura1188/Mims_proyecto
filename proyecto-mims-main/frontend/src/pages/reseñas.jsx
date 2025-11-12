import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Reseñas() {
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerReseñas = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/mensajes/resenas/");
        setReseñas(response.data);
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerReseñas();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Cargando reseñas...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10 px-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 mb-8"
      >
        Opiniones de Nuestros Clientes
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {reseñas.length > 0 ? (
          reseñas.map((reseña) => (
            <motion.div
              key={reseña.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-lg rounded-2xl p-6 border hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{reseña.nombre}</h2>
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < reseña.calificacion ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill={i < reseña.calificacion ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="text-gray-700">{reseña.comentario}</p>
              <p className="text-sm text-gray-500 mt-3">
                {new Date(reseña.fecha).toLocaleDateString("es-CO")}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No hay reseñas disponibles aún.
          </p>
        )}
      </div>
    </div>
  );
}
