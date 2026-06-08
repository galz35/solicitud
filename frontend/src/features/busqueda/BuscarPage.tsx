import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, RefreshCw, FileText, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { apiService } from '../../services/api.service';
import { Toast, ToastType } from '../../components/ui/Toast';

export const BuscarPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, pages: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleBuscar = useCallback(async (searchQuery = query, targetPage = page) => {
    setIsLoading(true);
    try {
      const res = await apiService.buscarCandidatos(searchQuery, targetPage, 10);
      setCandidatos(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1, limit: 10 });
    } catch (err) {
      showToast('Error al recuperar registros de candidatos.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user || user.rol !== 'admin') {
      showToast('No tiene permisos para ver esta sección.', 'error');
      navigate('/login');
      return;
    }
    handleBuscar('', 1);
  }, [navigate, handleBuscar]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setPage(1);
      handleBuscar(query, 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleBuscar(query, newPage);
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: '2rem 1rem' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
            Panel de Reclutamiento
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Búsqueda, gestión e impresión de solicitudes registradas en el sistema.
          </p>
        </div>
        <button 
          onClick={handleLogout} 
          className="btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>

      {/* Caja de Búsqueda */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Buscar por Nombre, Apellido, Cédula o Puesto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>
        <button 
          onClick={() => { setPage(1); handleBuscar(query, 1); }} 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={isLoading}
        >
          <Search size={16} /> Buscar
        </button>
        <button 
          onClick={() => { setQuery(''); setPage(1); handleBuscar('', 1); }} 
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={isLoading}
        >
          <RefreshCw size={16} /> Limpiar
        </button>
      </div>

      {/* Resultados */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            Buscando candidatos...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : candidatos.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No se encontraron candidatos que coincidan con la búsqueda.
          </div>
        ) : (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Cédula</th>
                    <th style={{ padding: '1rem' }}>Nombre Completo</th>
                    <th style={{ padding: '1rem' }}>Puesto Solicitado</th>
                    <th style={{ padding: '1rem' }}>Celular</th>
                    <th style={{ padding: '1rem' }}>Fecha Solicitud</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatos.map((cand) => (
                    <tr key={cand.candidato_id} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row">
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{cand.cedula}</td>
                      <td style={{ padding: '1rem' }}>
                        {cand.pnombre} {cand.snombre || ''} {cand.papellido} {cand.sapellido || ''}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                          {cand.puesto}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{cand.celular || 'N/A'}</td>
                      <td style={{ padding: '1rem' }}>
                        {cand.fecha_sol ? new Date(cand.fecha_sol).toLocaleDateString('es-NI') : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button 
                          onClick={() => navigate(`/impresion/${cand.cedula}`)}
                          className="btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Imprimir / Ver Solicitud"
                        >
                          <FileText size={14} /> Reporte
                        </button>
                        <button 
                          onClick={() => {
                            // Almacenar temporalmente y abrir en Wizard
                            localStorage.setItem('candidato', JSON.stringify({ cedula: cand.cedula, rol: 'admin', existe: true }));
                            navigate('/solicitud');
                          }}
                          className="btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Editar Ficha"
                        >
                          <Eye size={14} /> Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Página {page} de {pagination.pages} | Total: {pagination.total} registros
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 1}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page === pagination.pages}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', cursor: page === pagination.pages ? 'not-allowed' : 'pointer', opacity: page === pagination.pages ? 0.5 : 1 }}
                  >
                    Siguiente <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .table-row:hover {
          background-color: var(--bg-primary);
        }
      `}</style>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};
export default BuscarPage;
