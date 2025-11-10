import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Edit, ShoppingBag } from "lucide-react";

export default function PerfilCliente() {
  const [usuario, setUsuario] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const perfilRes = await axios.get("http://localhost:8000/api/usuarios/perfil/", config);
        setUsuario(perfilRes.data);

        const facturasRes = await axios.get("http://localhost:8000/api/facturas/historial/", config);
        setFacturas(facturasRes.data);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-700 text-lg">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-8">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-5xl p-8">
        {/* 🔹 Encabezado del perfil */}
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
              <User className="text-white" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-800">
                {usuario?.nombre_completo || usuario?.username}
              </h2>
              <p className="text-gray-500">{usuario?.email}</p>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2 transition">
            <Edit size={18} />
            Editar
          </button>
        </div>

        {/* 🔹 Información del usuario */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm text-gray-500">Usuario</label>
            <p className="text-gray-800 font-medium">{usuario?.username}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Rol</label>
            <p className="text-gray-800 font-medium">{usuario?.rol}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Teléfono</label>
            <p className="text-gray-800 font-medium">{usuario?.telefono || "—"}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Dirección</label>
            <p className="text-gray-800 font-medium">{usuario?.direccion || "—"}</p>
          </div>
        </div>

        {/* 🧾 HISTORIAL DE COMPRAS (facturas) */}
        {/* 🔸 ESTE ES EL BLOQUE DEL HISTORIAL DE FACTURAS 🔸 */}
        <div>
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <ShoppingBag size={22} /> Historial de Compras
          </h3>

          {facturas.length === 0 ? (
            <p className="text-gray-600">No tienes facturas registradas.</p>
          ) : (
            <div className="space-y-4">
              {facturas.map((factura) => (
                <div
                  key={factura.id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Factura N° {factura.id}</span>
                    <span>{new Date(factura.fecha_emision).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Método de Pago:</strong> {factura.metodo_pago}
                  </p>
                  <p className="font-semibold text-green-700 mt-1">
                    Total: ${factura.total.toFixed(2)}
                  </p>

                  {factura.detalles?.length > 0 && (
                    <ul className="list-disc ml-5 mt-2 text-gray-700">
                      {factura.detalles.map((d) => (
                        <li key={d.id}>
                          {d.medicamento_nombre} — {d.cantidad} unds — $
                          {d.subtotal.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
