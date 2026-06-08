import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Edit, LogOut } from 'lucide-react';
import { apiService } from '../../services/api.service';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidato, setCandidato] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getMe()
      .then((res: any) => setCandidato(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    apiService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={centerStyle}><p>Cargando...</p></div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Mi Solicitud de Empleo</h1>
        <button onClick={handleLogout} style={logoutBtnStyle}>
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div style={contentStyle}>
        {/* Info del candidato */}
        {candidato?.candidato && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={avatarStyle}>
                <User size={24} color="#6366f1" />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>
                  {candidato.candidato.pnombre} {candidato.candidato.papellido}
                </h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
                  Cédula: {candidato.candidato.cedula}
                </p>
              </div>
            </div>
            <div style={infoGridStyle}>
              {candidato.candidato.celular && (
                <div><strong>Celular:</strong> {candidato.candidato.celular}</div>
              )}
              {candidato.candidato.e_civil && (
                <div><strong>E. Civil:</strong> {
                  ({S: 'Soltero', C: 'Casado', V: 'Viudo', D: 'Divorciado', A: 'Acompañado'} as any)[candidato.candidato.e_civil] || candidato.candidato.e_civil
                }</div>
              )}
              {candidato.candidato.fecha_sol && (
                <div><strong>Registrado:</strong> {new Date(candidato.candidato.fecha_sol).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Puesto solicitado */}
        {candidato?.puesto && (
          <div style={cardStyle}>
            <h4>Puesto Solicitado</h4>
            <p><strong>{candidato.puesto.puesto}</strong></p>
            {candidato.puesto.salario_min && (
              <p>Salario: {candidato.puesto.salario_min} - {candidato.puesto.salario_max}</p>
            )}
          </div>
        )}

        {/* Acciones */}
        <div style={actionsStyle}>
          <button onClick={() => navigate('/solicitud')} style={actionBtnStyle}>
            <Edit size={18} />
            Editar mis datos
          </button>
          <button
            onClick={() => navigate(`/impresion/${candidato?.candidato?.cedula}`)}
            style={{ ...actionBtnStyle, background: '#0f172a' }}
          >
            <FileText size={18} />
            Ver solicitud completa
          </button>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  background: 'white',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const logoutBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  background: '#fee2e2',
  color: '#ef4444',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
};

const contentStyle: React.CSSProperties = {
  maxWidth: 600,
  margin: '24px auto',
  padding: '0 16px',
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const infoGridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 14,
};

const avatarStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 24,
  background: '#eef2ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
};

const actionBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 20px',
  background: '#6366f1',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
};

const centerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
