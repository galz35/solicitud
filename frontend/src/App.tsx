import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { RegistroPage } from './features/auth/RegistroPage';
import { SSOHandlerPage } from './features/auth/SSOHandlerPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { SolicitudWizard } from './features/solicitud/SolicitudWizard';
import { BuscarPage } from './features/busqueda/BuscarPage';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { AdminUsuariosPage } from './features/admin/AdminUsuariosPage';
import { ImprimirPage } from './features/impresion/ImprimirPage';
import { Layout } from './components/layout/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function WizardRoute() {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams(window.location.search);
  const invToken = params.get('token');

  // Guest with invitation token → no layout
  if (!token && invToken) return <SolicitudWizard />;

  // Authenticated user → with layout
  if (token) return <Layout><SolicitudWizard /></Layout>;

  // Not authenticated → redirect
  return <Navigate to="/login" replace />;
}
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter basename="/solicitud">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/auth/sso" element={<SSOHandlerPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/solicitud" element={<WizardRoute />} />
        <Route path="/buscar" element={<ProtectedRoute><BuscarPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsuariosPage /></ProtectedRoute>} />
        <Route path="/impresion/:cedula" element={<ProtectedRoute><ImprimirPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
