import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { RegistroPage } from './features/auth/RegistroPage';
import { SSOHandlerPage } from './features/auth/SSOHandlerPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { SolicitudWizard } from './features/solicitud/SolicitudWizard';
import { BuscarPage } from './features/busqueda/BuscarPage';
import { ImprimirPage } from './features/impresion/ImprimirPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/auth/sso" element={<SSOHandlerPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/solicitud" element={<ProtectedRoute><SolicitudWizard /></ProtectedRoute>} />
        <Route path="/buscar" element={<ProtectedRoute><BuscarPage /></ProtectedRoute>} />
        <Route path="/impresion/:cedula" element={<ProtectedRoute><ImprimirPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
