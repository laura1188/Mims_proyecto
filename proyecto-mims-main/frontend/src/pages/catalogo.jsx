import React, { useEffect, useState } from "react";
import { getCatalogoPublico } from "./inventarioServices";
import "./CatalogoMedicamentos.css";



const CatalogoMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const data = await getCatalogoPublico();
      setMedicamentos(data);
      setLoading(false);
    };
    cargar();
  }, []);

  if (loading) return <p>Cargando catálogo...</p>;

  return (
    <div className="catalogo-container">
      {medicamentos.map(med => (
        <div className="card" key={med.id}>
          <h3>{med.nombre}</h3>
          <p>{med.descripcion ? med.descripcion.substring(0, 100) : "Sin descripción"}</p>
          <p className="precio">Precio: ${med.precio_venta}</p>
          <p>Stock: {med.stock_actual}</p>
        </div>
      ))}
    </div>
  );
};

export default CatalogoMedicamentos;
