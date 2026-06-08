import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api.service';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = apiService.getCurrentUser();
  const isAdmin = user?.rol === 'admin';
  const currentPath = location.pathname.replace('/solicitud', '') || '/';

  const items = [
    { path: '/dashboard', label: 'Mi Perfil', icon: '👤', adminOnly: false },
    { path: '/solicitud', label: 'Mi Solicitud', icon: '📋', adminOnly: false },
    ...(isAdmin ? [
      { path: '/admin', label: 'Panel RH', icon: '⚙️', adminOnly: true },
      { path: '/admin/usuarios', label: 'Usuarios', icon: '👥', adminOnly: true },
    ] : []),
  ];

  const isActive = (p: string) => p === '/' ? (currentPath === '/' || currentPath === '') : currentPath.startsWith(p);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Navbar */}
      <div style={{
        height: 60, background: '#fff', borderBottom: '1px solid #e4e7ec',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setOpen(!open)}
            style={{
              width: 36, height: 36, border: 'none', borderRadius: 8,
              background: open ? '#e8f5e9' : '#f5f5f5', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', color: '#333', fontSize: 18
            }}>
            {open ? '✕' : '☰'}
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#0d9488' }}>Portal Solicitud</span>
          {isAdmin && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#0d9488',
              background: '#d1fae5', padding: '2px 8px', borderRadius: 20,
              display: 'none'
            } as React.CSSProperties} className="admin-badge">Admin</span>
          )}
        </div>
        <button onClick={() => { apiService.logout(); navigate('/login'); }}
          style={{
            padding: '6px 14px', border: '1px solid #fee2e2', borderRadius: 8,
            background: '#fef2f2', color: '#dc2626', cursor: 'pointer',
            fontSize: 12, fontWeight: 500
          }}>
          Salir
        </button>
      </div>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 998, animation: 'fadeIn 0.2s' }} />}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 60, left: 0, bottom: 0, width: 250,
        background: '#fff', borderRight: '1px solid #e4e7ec',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 999, display: 'flex', flexDirection: 'column',
        boxShadow: open ? '4px 0 20px rgba(0,0,0,0.06)' : 'none'
      }}>
        {/* User */}
        <div style={{
          padding: '18px 20px', borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #0d9488, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 10
          }}>{(user?.nombre || user?.cedula || 'U')[0]}</div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>{user?.nombre || user?.cedula || 'Usuario'}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{user?.email || user?.cedula || ''}</div>
          {isAdmin && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: '#0d9488', background: '#d1fae5', display: 'inline-block', padding: '2px 10px', borderRadius: 20 }}>Administrador</div>}
        </div>

        {/* Menu */}
        <div style={{ flex: 1, padding: '8px 12px' }}>
          {items.map((item) => (
            <button key={item.path} onClick={() => { setOpen(false); navigate(item.path); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '10px 14px', border: 'none', borderRadius: 10, cursor: 'pointer',
                fontSize: 14, textAlign: 'left', marginBottom: 2,
                background: isActive(item.path) ? 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' : 'transparent',
                color: isActive(item.path) ? '#0d9488' : '#444',
                fontWeight: isActive(item.path) ? 600 : 400, transition: 'all 0.15s'
              }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
              {isActive(item.path) && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#0d9488' }} />}
            </button>
          ))}
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0', fontSize: 12, color: '#999' }}>
          Solicitud de Empleo v1.0
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }} className="layout-content">
        {children}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (min-width: 768px) { .admin-badge { display: inline !important; } }
        @media (max-width: 640px) { 
          .layout-content { padding: 12px !important; }
        }
      `}</style>
    </div>
  );
};
