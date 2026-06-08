import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getStyleConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={20} color="var(--color-success)" />,
          bg: 'var(--color-success-light)',
          border: 'var(--color-success)',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} color="var(--color-warning)" />,
          bg: 'var(--color-warning-light)',
          border: 'var(--color-warning)',
        };
      case 'error':
        return {
          icon: <XCircle size={20} color="var(--color-error)" />,
          bg: 'var(--color-error-light)',
          border: 'var(--color-error)',
        };
      case 'info':
      default:
        return {
          icon: <Info size={20} color="var(--color-info)" />,
          bg: 'var(--color-info-light)',
          border: 'var(--color-info)',
        };
    }
  };

  const config = getStyleConfig();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        backgroundColor: config.bg,
        borderLeft: `4px solid ${config.border}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        fontWeight: 500,
        minWidth: '300px',
        maxWidth: '450px',
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div>{config.icon}</div>
      <div style={{ flex: 1 }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          borderRadius: '50%',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
