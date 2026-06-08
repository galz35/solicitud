import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Link as LinkIcon, Users, Eye, LogOut, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api.service';
import { Toast, ToastType } from '../../components/ui/Toast';
import { FormField } from '../../components/ui/FormField';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'candidatos' | 'invitar'>('candidatos');

  // Búsqueda
  const [query, setQuery] = useState('');
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Invitación
  const [invCedula, setInvCedula] = useState('');
  const [invNombres, setInvNombres] = useState('');
  const [invApellidos, setInvApellidos] = useState('');
  const [invCelular, setInvCelular] = useState('');
  const [invDias, setInvDias] = useState(30);
  const [invLink, setInvLink] = useState('');
  const [invLoading, setInvLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (msg: string, type: ToastType) => setToast({ message: msg, type });

  const cargar = useCallback(async (q = query, p = page) => {
    setLoading(true);
    try {
      const res = await apiService.buscarCandidatos(q, p, 15);
      setCandidatos(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1 });
    } catch { showToast('Error al cargar candidatos', 'error'); }
    finally { setLoading(false); }
  }, [query, page]);

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user || user.rol !== 'admin') {
      navigate('/login');
      return;
    }
    cargar('', 1);
  }, [navigate, cargar]);

  const generarLink = async () => {
    if (!invCedula) { showToast('Cédula requerida', 'warning'); return; }
    setInvLoading(true);
    try {
      const res = await apiService.generarInvitacion(invCedula, invNombres, invApellidos, invCelular, invDias);
      setInvLink(res.link);
      showToast('Link generado', 'success');
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Error al generar link', 'error');
    }
    finally { setInvLoading(false); }
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(invLink).then(() => showToast('Link copiado', 'success'));
  };

  return (
    <div>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <Users size={24} color="var(--primary)" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{pagination.total}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Candidatos</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <LinkIcon size={24} color="#0d9488" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0d9488' }}>{invLink ? '1' : '0'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Links creados</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem' }}>
          <button onClick={() => setTab('candidatos')} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', background: tab === 'candidatos' ? 'var(--primary)' : 'var(--bg-secondary)', color: tab === 'candidatos' ? '#fff' : 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
            <Users size={16} style={{ marginRight: 6 }} /> Candidatos
          </button>
          <button onClick={() => setTab('invitar')} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', background: tab === 'invitar' ? 'var(--primary)' : 'var(--bg-secondary)', color: tab === 'invitar' ? '#fff' : 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
            <LinkIcon size={16} style={{ marginRight: 6 }} /> Generar Link
          </button>
        </div>

        {/* TAB: Candidatos */}
        {tab === 'candidatos' && (
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { setPage(1); cargar(query, 1); } }}
                  placeholder="Buscar por cédula, nombre o puesto..."
                  style={{ width: '100%', padding: '0.625rem 2.5rem 0.625rem 0.875rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', background: 'var(--bg-secondary)' }}
                />
                <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              </div>
              <button onClick={() => { setPage(1); cargar(query, 1); }} style={{ padding: '0.625rem 1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <RefreshCw size={16} />
              </button>
              <button onClick={() => apiService.exportarCandidatos(query)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.625rem 1rem', background: '#0d9488', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <Download size={16} /> Excel
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando...</div>
            ) : candidatos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No hay candidatos registrados</div>
            ) : (
              <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Cédula</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Celular</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Puesto</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Registro</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatos.map((c: any) => (
                      <tr key={c.candidato_id || c.cedula} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{c.cedula}</td>
                        <td style={{ padding: '0.75rem' }}>{c.pnombre} {c.papellido}</td>
                        <td style={{ padding: '0.75rem' }}>{c.celular || '-'}</td>
                        <td style={{ padding: '0.75rem' }}>{c.puesto || '-'}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.8rem' }}>{c.fecha_sol ? new Date(c.fecha_sol).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <button onClick={() => navigate(`/impresion/${c.cedula}`)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginación */}
                {pagination.pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '1rem' }}>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => { setPage(p); cargar(query, p); }} style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: p === page ? 'var(--primary)' : 'var(--bg-secondary)', color: p === page ? '#fff' : 'var(--text-primary)', cursor: 'pointer' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: Generar Link */}
        {tab === 'invitar' && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Generar link de invitación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Cédula" id="invCedula" value={invCedula} onChange={(e: any) => setInvCedula(e.target.value.toUpperCase())} required placeholder="0012508900012A" />
              <FormField label="Celular" id="invCelular" value={invCelular} onChange={(e: any) => setInvCelular(e.target.value)} placeholder="88888888" />
              <FormField label="Nombres" id="invNombres" value={invNombres} onChange={(e: any) => setInvNombres(e.target.value)} placeholder="Juan Carlos" />
              <FormField label="Apellidos" id="invApellidos" value={invApellidos} onChange={(e: any) => setInvApellidos(e.target.value)} placeholder="Pérez López" />
            </div>

            <button onClick={generarLink} disabled={invLoading} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
              {invLoading ? 'Generando...' : 'Generar Link'}
            </button>

            {invLink && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Link de invitación:</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input readOnly value={invLink} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', background: '#fff' }} />
                  <button onClick={copiarLink} style={{ padding: '0.5rem 1rem', background: '#0d9488', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                    Copiar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
