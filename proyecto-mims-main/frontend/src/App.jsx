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
import Navbar from "./components/Navbar.jsx";
import Acerca from "./pages/Acerca.jsx";
import Reseñas from "./pages/reseñas.jsx";
import Mensajes from "./pages/Mensajes.jsx";
import Contacto from "./pages/Contacto.jsx"; // 👈 añadimos la nueva página

// 👇 componente para proteger rutas según rol
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
    <>
      {/* Navbar siempre visible en todas las páginas */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 🌐 Rutas públicas */}
        <Route path="/home" element={<Home />} />
        <Route path="/catalogo" element={<CatalogoMedicamentos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/acerca" element={<Acerca />} />
        <Route path="/reseñas" element={<Reseñas />} />
        <Route path="/recuperar" element={<EnviarCorreoRecuperacion />} />
        <Route path="/cambiar-contrasena" element={<CambiarPassword />} />

        {/* 🔒 Rutas protegidas por rol */}
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

        {/* 👨‍💼 Página de mensajes (solo admin) */}
        <Route
          path="/mensajes"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Mensajes />
            </PrivateRoute>
          }
        />

        {/* 📩 Página de contacto (pública, visible a todos los usuarios) */}
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </>
  );
}
