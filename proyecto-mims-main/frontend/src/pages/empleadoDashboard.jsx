import React, { useState } from "react";
import Sidebar from "./sidebar";
import MedicamentosEmpleado from "./medicamentosEmpleado";
import PanelEmpleado from "./panelFactura";
import PanelPedidos from "./PanelPedidos"; // Importar correctamente la sección
import "./empleadoDashboard.css";

const EmpleadoDashboard = () => {
  const [seccionActual, setSeccionActual] = useState("medicamentos");

  return (
    <div className="dashboard-container">
      <Sidebar setSeccion={setSeccionActual} seccionActual={seccionActual} />

      <div className="contenido-principal">
        {seccionActual === "medicamentos" && <MedicamentosEmpleado />}
        {seccionActual === "facturas" && <PanelEmpleado />}
        {seccionActual === "pedidos" && <PanelPedidos />} {/* Nueva sección */}
      </div>
    </div>
  );
};

export default EmpleadoDashboard;
