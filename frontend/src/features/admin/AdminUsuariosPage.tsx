import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api.service';
import { Toast, ToastType } from '../../components/ui/Toast';

export const AdminUsuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cedula, setCedula] = useState('');
  const [asignando, setAsignando] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (msg: string, type: ToastType) => setToast({ message: msg, type });

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await apiService.listarUsuarios();
      setUsuarios(res.data || []);
    } catch { showToast('Error al cargar', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user || user.rol !== 'admin') { navigate('/login'); return; }
    cargar();
  }, [navigate]);

  const asignar = async () => {
    if (!cedula) { showToast('Ingresa una cédula', 'warning'); return; }
    setAsignando(true);
    try {
      await apiService.asignarAdmin(cedula.toUpperCase());
      showToast('✅ Admin asignado correctamente', 'success');
      setCedula('');
      cargar();
    } catch (e: any) { showToast(e.response?.data?.message || 'Error', 'error'); }
    finally { setAsignando(false); }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, color: '#1a1a1a' }}>Usuarios del Sistema</h1>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>Administra los accesos al portal de solicitudes</p>
      </div>

      {/* Assign admin card */}
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid #e4e7ec',
        padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 16, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
          👑 Asignar Administrador
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888' }}>
          Usuarios con rol admin pueden gestionar candidatos, generar links y administrar el sistema
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>Cédula del usuario</label>
            <input value={cedula} onChange={e => setCedula(e.target.value.toUpperCase())}
              placeholder="0012508900012A"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e4e7ec', borderRadius: 8, fontSize: 13, outline: 'none' }} />
          </div>
          <button onClick={asignar} disabled={asignando}
            style={{
              padding: '10px 24px', border: 'none', borderRadius: 10,
              background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap'
            }}>
            {asignando ? '⏳...' : 'Hacer Admin'}
          </button>
        </div>
      </div>

      {/* Users table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
          Cargando usuarios...
        </div>
      ) : (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid #e4e7ec',
          overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e7ec' }}>
                {['Cédula', 'Nombre', 'Email', 'Rol', 'Registro'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#666', fontWeight: 600, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Sin usuarios registrados</td></tr>
              ) : usuarios.map((u: any) => (
                <tr key={u.id_usuario} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#333' }}>{u.cedula}</td>
                  <td style={{ padding: '12px 14px', color: '#1a1a1a' }}>{u.pnombre} {u.papellido}</td>
                  <td style={{ padding: '12px 14px', color: '#666' }}>{u.email || '-'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: u.rol === 'admin' ? '#d1fae5' : '#f5f5f5',
                      color: u.rol === 'admin' ? '#0d9488' : '#888'
                    }}>
                      {u.rol === 'admin' ? '👑 Admin' : '👤 Candidato'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#888', fontSize: 12 }}>
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
