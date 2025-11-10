import React from "react";
import "./sidebar.css";

const Sidebar = ({ setSeccion, seccionActual }) => {
  return (
    <div className="sidebar">
      <h2>Panel Empleado</h2>
      <ul>
        <li
          className={seccionActual === "medicamentos" ? "active" : ""}
          onClick={() => setSeccion("medicamentos")}
        >
          💊 Medicamentos
        </li>
        <li
          className={seccionActual === "facturas" ? "active" : ""}
          onClick={() => setSeccion("facturas")}
        >
          🧾 Facturas
        </li>
        <li
          className={seccionActual === "pedidos" ? "active" : ""}
          onClick={() => setSeccion("pedidos")}
        >
          📝 Pedidos {/* Nueva sección */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
