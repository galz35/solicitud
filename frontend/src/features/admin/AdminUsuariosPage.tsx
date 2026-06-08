import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserPlus, Search } from 'lucide-react';
import { apiService } from '../../services/api.service';
import { Toast, ToastType } from '../../components/ui/Toast';
import { FormField } from '../../components/ui/FormField';

export const AdminUsuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Asignar admin
  const [cedulaAdmin, setCedulaAdmin] = useState('');
  const [asignando, setAsignando] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (msg: string, type: ToastType) => setToast({ message: msg, type });

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await apiService.listarUsuarios();
      setUsuarios(res.data || []);
    } catch { showToast('Error al cargar usuarios', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user || user.rol !== 'admin') { navigate('/login'); return; }
    cargar();
  }, [navigate]);

  const asignarAdmin = async () => {
    if (!cedulaAdmin) { showToast('Ingresa una cédula', 'warning'); return; }
    setAsignando(true);
    try {
      await apiService.asignarAdmin(cedulaAdmin.toUpperCase());
      showToast('Admin asignado correctamente', 'success');
      setCedulaAdmin('');
      cargar();
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Error', 'error');
    }
    finally { setAsignando(false); }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Gestionar Usuarios</h2>

      {/* Asignar admin */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={20} color="var(--primary)" /> Asignar Administrador
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <FormField label="Cédula del usuario" id="cedulaAdmin" value={cedulaAdmin}
              onChange={(e: any) => setCedulaAdmin(e.target.value.toUpperCase())}
              required placeholder="0012508900012A" />
          </div>
          <button onClick={asignarAdmin} disabled={asignando} style={{
            padding: '0.625rem 1.25rem', background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontWeight: 600, whiteSpace: 'nowrap', marginBottom: '0.25rem'
          }}>
            {asignando ? '...' : 'Hacer Admin'}
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando...</div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Cédula</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rol</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Sin usuarios registrados</td></tr>
              ) : usuarios.map((u: any) => (
                <tr key={u.id_usuario} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.cedula}</td>
                  <td style={{ padding: '0.75rem' }}>{u.pnombre} {u.papellido}</td>
                  <td style={{ padding: '0.75rem' }}>{u.email || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem',
                      fontWeight: 600,
                      background: u.rol === 'admin' ? 'var(--color-info-light)' : 'var(--bg-tertiary)',
                      color: u.rol === 'admin' ? 'var(--color-info)' : 'var(--text-secondary)'
                    }}>
                      {u.rol === 'admin' ? 'Admin' : 'Candidato'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                    {u.fecha_sol ? new Date(u.fecha_sol).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
