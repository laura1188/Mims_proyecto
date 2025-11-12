// src/pages/CatalogoMedicamentos.jsx
import React, { useEffect, useState } from "react";
import { getCatalogoPublico, getCategorias } from "../services/inventarioServices.js";
import "./CatalogoMedicamentos.css";

const CatalogoMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [medRes, catRes] = await Promise.all([
          getCatalogoPublico(),
          getCategorias()
        ]);
        setMedicamentos(medRes.data);
        setCategorias(catRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos del catálogo");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="catalogo-container">
      <section className="categorias-seccion">
        <h2>Categorías</h2>
        <div className="categorias-grid">
          {categorias.length === 0 ? (
            <p>No hay categorías disponibles.</p>
          ) : (
            categorias.map((cat) => (
              <div key={cat.id} className="categoria-card">
                <h3>{cat.nombre}</h3>
                <p>{cat.descripcion || "Sin descripción"}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="medicamentos-seccion">
        <h2>Medicamentos</h2>
        <div className="medicamentos-grid">
          {medicamentos.length === 0 ? (
            <p>No hay medicamentos disponibles.</p>
          ) : (
            medicamentos.map((med) => (
              <div key={med.id} className="medicamento-card">
                <h3>{med.nombre}</h3>
                <p>{med.descripcion ? med.descripcion.substring(0, 100) + "..." : "Sin descripción"}</p>
                <p className="precio">Precio: ${med.precio_venta}</p>
                <p className="stock">Stock: {med.stock_actual}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default CatalogoMedicamentos;