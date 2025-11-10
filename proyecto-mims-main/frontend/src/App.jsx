// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home.jsx";
import CatalogoMedicamentos from "./pages/catalogo.jsx";
import Registro from "./pages/registro.jsx";
import Login from "./pages/login.jsx";
import PerfilCliente from "./pages/perfilCliente.jsx";
import PanelAdmin from "./pages/panelAdmin.jsx";
import EmpleadoDashboard from "./pages/empleadoDashboard.jsx";
import EnviarCorreoRecuperacion from "./pages/EnviarCorreoRecuperacion.jsx";
import CambiarPassword from "./pages/CambiarPassword.jsx";

// 👇 componentes de protección
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("usuario") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.rol))
    return <Navigate to="/home" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Públicas */}
      <Route path="/home" element={<Home />} />
      <Route path="/catalogo" element={<CatalogoMedicamentos />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar" element={<EnviarCorreoRecuperacion />} />
      <Route path="/cambiar-contrasena" element={<CambiarPassword />} />

      {/* Protegidas */}
      <Route
        path="/perfilcliente"
        element={
          <PrivateRoute allowedRoles={["cliente"]}>
            <PerfilCliente />
          </PrivateRoute>
        }
      />

      <Route
        path="/paneladmin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <PanelAdmin />
          </PrivateRoute>
        }
      />

      <Route
        path="/panelempleado"
        element={
          <PrivateRoute allowedRoles={["empleado"]}>
            <EmpleadoDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
