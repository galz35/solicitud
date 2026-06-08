import React, { useEffect } from 'react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, string> = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
};

const colors: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: '#f0fdf4', border: '#86efac', text: '#166534' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
  info: { bg: '#f0fdf4', border: '#a7f3d0', text: '#166534' },
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const c = colors[type];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-lg)',
      background: c.bg, border: `1px solid ${c.border}`,
      boxShadow: 'var(--shadow-lg)', color: c.text,
      fontSize: '0.9rem', fontWeight: 500,
      minWidth: 300, maxWidth: 450,
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      zIndex: 2000, animation: 'slideUp 0.35s ease',
      backdropFilter: 'blur(8px)'
    }}>
      <span style={{ fontSize: 18 }}>{icons[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: 2, color: c.text, opacity: 0.6, fontSize: 16
      }}>✕</button>
    </div>
  );
};
