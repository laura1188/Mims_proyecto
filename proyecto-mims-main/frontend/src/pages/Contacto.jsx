import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState(null);

  // 🔹 Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setEstado(null);

    try {
      // Asegúrate de que la URL coincida con la de tu Django backend
      await axios.post("http://127.0.0.1:8000/api/mensajes/", formData);
      setEstado("✅ ¡Tu mensaje ha sido enviado con éxito!");
      setFormData({ nombre: "", correo: "", asunto: "", mensaje: "" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setEstado("❌ Error al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-6 flex flex-col items-center">
      {/* 🔹 Encabezado */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-blue-700 mb-6 text-center"
      >
        Contáctanos
      </motion.h1>

      {/* 🔹 Información general y formulario */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg rounded-2xl p-8 border max-w-3xl w-full mb-10"
      >
        {/* Información de contacto */}
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Información de contacto
        </h2>
        <p className="text-gray-700 mb-6">
          Si deseas comunicarte con nosotros, puedes hacerlo a través del
          formulario o mediante los siguientes medios. Nuestro equipo responderá
          lo antes posible.
        </p>

        <ul className="text-gray-700 space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <MapPin className="text-green-500" size={20} /> Calle 10 #25-45,
            Bogotá D.C.
          </li>
          <li className="flex items-center gap-2">
            <Phone className="text-green-500" size={20} /> +57 312 456 7890
          </li>
          <li className="flex items-center gap-2">
            <Mail className="text-green-500" size={20} /> contacto@mims.co
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-green-600 mb-3">
          Envíanos un mensaje
        </h3>

        {/* 🔹 Formulario de contacto */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />

          <input
            type="email"
            name="correo"
            placeholder="Tu correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />

          <input
            type="text"
            name="asunto"
            placeholder="Asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 md:col-span-2 focus:ring-2 focus:ring-green-400"
          />

          <textarea
            name="mensaje"
            placeholder="Escribe tu mensaje aquí..."
            rows="5"
            value={formData.mensaje}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 md:col-span-2 focus:ring-2 focus:ring-green-400"
          ></textarea>

          <button
            type="submit"
            disabled={enviando}
            className={`md:col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg transition hover:opacity-90 ${
              enviando ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Send size={18} />
            {enviando ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>

        {/* 🔹 Mensaje de estado */}
        {estado && (
          <p className="text-center mt-5 font-medium text-green-700 bg-green-100 py-2 rounded-lg">
            {estado}
          </p>
        )}
      </motion.div>
    </div>
  );
}
