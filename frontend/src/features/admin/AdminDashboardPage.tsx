import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api.service';
import { Toast, ToastType } from '../../components/ui/Toast';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'candidatos' | 'invitar'>('candidatos');
  const [query, setQuery] = useState('');
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [invCedula, setInvCedula] = useState('');
  const [invNombres, setInvNombres] = useState('');
  const [invApellidos, setInvApellidos] = useState('');
  const [invCelular, setInvCelular] = useState('');
  const [invLink, setInvLink] = useState('');
  const [invLoading, setInvLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (msg: string, type: ToastType) => setToast({ message: msg, type });

  const cargar = useCallback(async (q = query, p = page) => {
    setLoading(true);
    try {
      const res = await apiService.buscarCandidatos(q, p, 15);
      setCandidatos(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1 });
    } catch { showToast('Error al cargar', 'error'); }
    finally { setLoading(false); }
  }, [query, page]);

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user || user.rol !== 'admin') { navigate('/login'); return; }
    cargar('', 1);
  }, [navigate, cargar]);

  const generarLink = async () => {
    if (!invCedula) { showToast('Cédula requerida', 'warning'); return; }
    setInvLoading(true);
    try {
      const res = await apiService.generarInvitacion(invCedula, invNombres, invApellidos, invCelular, 30);
      setInvLink(res.link);
      showToast('Link generado ✅', 'success');
    } catch (e: any) { showToast(e.response?.data?.message || 'Error', 'error'); }
    finally { setInvLoading(false); }
  };

  const tabs = [
    { id: 'candidatos', label: 'Candidatos', icon: '👥' },
    { id: 'invitar', label: 'Generar Link', icon: '🔗' },
  ] as const;

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, color: '#1a1a1a' }}>Panel RH</h1>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>Gestión de solicitudes de empleo</p>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
        borderRadius: 14, border: '1px solid #bbf7d0',
        padding: '18px 22px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>🔗 Generar link de invitación</div>
          <div style={{ fontSize: 13, color: '#15803d', marginTop: 2 }}>
            Creá un enlace único para que un candidato complete su solicitud
          </div>
        </div>
        <button onClick={() => setTab('invitar')}
          style={{
            padding: '10px 24px', border: 'none', borderRadius: 10,
            background: 'linear-gradient(135deg, #0d9488, #059669)',
            color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 2px 8px rgba(13,148,136,0.25)',
            whiteSpace: 'nowrap'
          }}>
          + Nuevo Link
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { value: pagination.total, label: 'Candidatos', icon: '👥', color: '#0d9488', bg: '#f0fdf4' },
          { value: invLink ? 1 : 0, label: 'Links generados', icon: '🔗', color: '#6366f1', bg: '#eef2ff' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: '18px 20px',
            border: '1px solid #e4e7ec', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f5f5f5', borderRadius: 12, padding: 4 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '10px 16px', border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? '#0d9488' : '#666',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s'
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Candidatos */}
      {tab === 'candidatos' && (
        <div>
          {/* Search + Export */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 14, color: '#999' }}>🔍</span>
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setPage(1); cargar(query, 1); } }}
                placeholder="Buscar por nombre, cédula o puesto..."
                style={{
                  width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e4e7ec',
                  borderRadius: 10, fontSize: 14, background: '#fff',
                  outline: 'none', transition: 'border 0.2s'
                }} />
            </div>
            <button onClick={() => { setPage(1); cargar(query, 1); }}
              style={{
                padding: '10px 18px', border: 'none', borderRadius: 10,
                background: '#0d9488', color: '#fff', cursor: 'pointer', fontSize: 14
              }}>Buscar</button>
            <button onClick={() => apiService.exportarCandidatos(query)}
              style={{
                padding: '10px 18px', border: 'none', borderRadius: 10,
                background: '#1e293b', color: '#fff', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 6
              }}>
              📥 Excel
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
              Cargando candidatos...
            </div>
          ) : candidatos.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px', background: '#fff',
              borderRadius: 14, border: '1px solid #e4e7ec'
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <div style={{ color: '#999', fontSize: 15 }}>No hay candidatos registrados</div>
            </div>
          ) : (
            <div style={{
              background: '#fff', borderRadius: 14, border: '1px solid #e4e7ec',
              overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e7ec' }}>
                    {['Cédula', 'Nombre', 'Contacto', 'Puesto', 'Registro', ''].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#666', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidatos.map((c: any) => (
                    <tr key={c.candidato_id || c.cedula}
                      style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#333' }}>{c.cedula}</td>
                      <td style={{ padding: '12px 14px', color: '#1a1a1a' }}>{c.pnombre} {c.papellido}</td>
                      <td style={{ padding: '12px 14px', color: '#666' }}>{c.celular || '-'}</td>
                      <td style={{ padding: '12px 14px', color: '#555' }}>{c.puesto || '-'}</td>
                      <td style={{ padding: '12px 14px', color: '#888', fontSize: 12 }}>
                        {c.fecha_sol ? new Date(c.fecha_sol).toLocaleDateString() : '-'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => navigate(`/impresion/${c.cedula}`)}
                          style={{
                            padding: '4px 12px', border: '1px solid #e4e7ec', borderRadius: 6,
                            background: '#fff', cursor: 'pointer', fontSize: 12, color: '#555'
                          }}>Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, padding: '14px', borderTop: '1px solid #f0f0f0' }}>
                  {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => { setPage(p); cargar(query, p); }}
                      style={{
                        padding: '6px 12px', border: '1px solid #e4e7ec', borderRadius: 6,
                        background: p === page ? '#0d9488' : '#fff',
                        color: p === page ? '#fff' : '#555', cursor: 'pointer', fontSize: 13
                      }}>{p}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Generar Link */}
      {tab === 'invitar' && (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e4e7ec',
          padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 18, color: '#1a1a1a' }}>Generar link de invitación</h3>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#888' }}>
            Crea un enlace único para que el candidato complete su solicitud
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>Cédula *</label>
              <input value={invCedula} onChange={e => setInvCedula(e.target.value.toUpperCase())}
                placeholder="0012508900012A"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e7ec', borderRadius: 8, fontSize: 13, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>Celular</label>
              <input value={invCelular} onChange={e => setInvCelular(e.target.value)}
                placeholder="88888888"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e7ec', borderRadius: 8, fontSize: 13, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>Nombres</label>
              <input value={invNombres} onChange={e => setInvNombres(e.target.value)}
                placeholder="Juan Carlos"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e7ec', borderRadius: 8, fontSize: 13, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>Apellidos</label>
              <input value={invApellidos} onChange={e => setInvApellidos(e.target.value)}
                placeholder="Pérez López"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e7ec', borderRadius: 8, fontSize: 13, outline: 'none' }} />
            </div>
          </div>

          <button onClick={generarLink} disabled={invLoading}
            style={{
              marginTop: 18, padding: '10px 28px', border: 'none', borderRadius: 10,
              background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff',
              cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s'
            }}>
            {invLoading ? '⏳ Generando...' : '🔗 Generar Link'}
          </button>

          {invLink && (
            <div style={{
              marginTop: 20, padding: 18, background: '#f0fdf4',
              borderRadius: 10, border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginBottom: 8 }}>✅ Link generado exitosamente</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={invLink}
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 12, background: '#fff', color: '#333' }} />
                <button onClick={() => {
                  navigator.clipboard.writeText(invLink).then(() => {
                    setCopied(true);
                    showToast('Link copiado 📋', 'success');
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                  style={{
                    padding: '10px 18px', border: 'none', borderRadius: 8,
                    background: '#0d9488', color: '#fff', cursor: 'pointer', fontSize: 13,
                    fontWeight: 600
                  }}>
                  {copied ? '✅' : 'Copiar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
