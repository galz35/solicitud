import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api.service';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidato, setCandidato] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = apiService.getCurrentUser();
  const isAdmin = user?.rol === 'admin';

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
      return;
    }
    apiService.getMe()
      .then((res: any) => setCandidato(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
        <div style={{ color: '#999' }}>Cargando tu información...</div>
      </div>
    </div>
  );

  const c = candidato?.candidato;
  const puesto = candidato?.puesto;

  return (
    <div className="fade-in">
      {/* Profile card */}
      {c && (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e4e7ec',
          overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 16
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d9488, #059669)',
            padding: '24px 24px 60px', position: 'relative'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, color: '#fff', marginBottom: 12
            }}>
              {c.pnombre?.[0]}{c.papellido?.[0]}
            </div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{c.pnombre} {c.papellido}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>{c.cedula}</div>
          </div>

          <div style={{ padding: '0 24px 24px', marginTop: -40 }}>
            <div style={{
              background: '#fff', borderRadius: 12, border: '1px solid #e4e7ec',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)', padding: 16
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Celular', value: c.celular },
                  { label: 'Estado Civil', value: ({ S: 'Soltero', C: 'Casado', V: 'Viudo', D: 'Divorciado', A: 'Acompañado' } as any)[c.e_civil] || c.e_civil },
                  { label: 'Email', value: user?.email || '-' },
                  { label: 'Registrado', value: c.fecha_sol ? new Date(c.fecha_sol).toLocaleDateString() : '-' },
                  { label: 'Departamento', value: c.departamento_dom || '-' },
                  { label: 'Ciudad', value: c.ciudad_dom || '-' },
                ].map((f, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{f.value || '-'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Position card */}
      {puesto?.puesto && (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e4e7ec',
          padding: 20, marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0d9488', marginBottom: 8 }}>🎯 Puesto Solicitado</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{puesto.puesto}</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
            {puesto.turno} {puesto.salario_min && `| C$${puesto.salario_min} - C$${puesto.salario_max}`}
          </div>
        </div>
      )}

      {/* Profile completeness */}
      {c && (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e4e7ec',
          padding: 20, marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0d9488', marginBottom: 12 }}>📊 Progreso de la Solicitud</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Familiares', count: candidato?.familiares?.length || 0 },
              { label: 'Educación', count: candidato?.academicos?.length || 0 },
              { label: 'Experiencia', count: candidato?.experiencia?.length || 0 },
              { label: 'Referencias', count: candidato?.referencias?.length || 0 },
              { label: 'Idiomas', count: candidato?.idiomas?.length || 0 },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#f8fafc', borderRadius: 8, padding: '10px 12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontSize: 12, color: '#666' }}>{item.label}</span>
                <span style={{
                  fontSize: 14, fontWeight: 700,
                  color: item.count > 0 ? '#0d9488' : '#ccc'
                }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={() => navigate('/solicitud')}
          style={{
            flex: 1, padding: '12px 20px', border: 'none', borderRadius: 10,
            background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s'
          }}>
          ✏️ Editar mis datos
        </button>
        <button onClick={() => navigate(`/impresion/${c?.cedula}`)}
          style={{
            flex: 1, padding: '12px 20px', border: '1px solid #e4e7ec', borderRadius: 10,
            background: '#fff', color: '#333', cursor: 'pointer', fontSize: 14, fontWeight: 500
          }}>
          📄 Ver solicitud completa
        </button>
      </div>
    </div>
  );
};
