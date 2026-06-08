import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, UserCircle, FileEdit, ClipboardList, Download, Shield, LogOut, ExternalLink } from 'lucide-react';
import { apiService } from '../../services/api.service';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = apiService.getCurrentUser();
  const isAdmin = user?.rol === 'admin';

  const menuItems = [
    { path: '/dashboard', label: 'Mi Perfil', icon: <UserCircle size={18} />, adminOnly: false },
    { path: '/solicitud', label: 'Editar Solicitud', icon: <FileEdit size={18} />, adminOnly: false },
    ...(isAdmin ? [
      { path: '/admin', label: 'Admin RRHH', icon: <Shield size={18} />, adminOnly: true },
      { path: '/admin/usuarios', label: 'Gestionar Usuarios', icon: <UsersIcon size={18} />, adminOnly: true },
    ] : [] as any[]),
    { path: '/', label: 'Portal Principal', icon: <ExternalLink size={18} />, adminOnly: false, external: true },
  ];

  const isActive = (path: string) => location.pathname === `/solicitud${path}` || location.pathname === path;

  const handleNavigate = (item: typeof menuItems[0]) => {
    setMenuOpen(false);
    if (item.external) {
      window.location.href = 'https://rhclaroni.com/portal/';
      return;
    }
    navigate(item.path);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1.25rem', background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)'
        }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
          Solicitud de Empleo
        </span>
        <button onClick={() => { apiService.logout(); navigate('/login'); }} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--color-error)', padding: '0.5rem'
        }}>
          <LogOut size={20} />
        </button>
      </div>

      {/* Hamburger menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)', zIndex: 99
        }} onClick={() => setMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 56, left: 0, bottom: 0, width: 260,
        background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease', zIndex: 100, overflowY: 'auto',
        padding: '1rem 0'
      }}>
        {menuItems.map((item, i) => (
          <button key={i} onClick={() => handleNavigate(item)} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            width: '100%', padding: '0.75rem 1.25rem',
            border: 'none', background: isActive(item.path) ? 'var(--primary-light)' : 'transparent',
            color: isActive(item.path) ? 'var(--primary)' : 'var(--text-primary)',
            fontWeight: isActive(item.path) ? 600 : 400,
            cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left'
          }}>
            {item.icon}
            <span>{item.label}</span>
            {item.external && <ExternalLink size={14} style={{ marginLeft: 'auto' }} />}
          </button>
        ))}

        {user && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)',
            fontSize: '0.8rem', color: 'var(--text-secondary)'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.nombre || user.cedula}</div>
            <div>{user.email || user.cedula}</div>
            {isAdmin && <span style={{ color: 'var(--color-info)', fontWeight: 600, fontSize: '0.75rem' }}>Administrador</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        marginLeft: 0, padding: '1rem', maxWidth: 1000, margin: '0 auto',
        paddingTop: '1rem'
      }}>
        {children}
      </div>
    </div>
  );
};

// Inline Users icon to avoid extra import
const UsersIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
