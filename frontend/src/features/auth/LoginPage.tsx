import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail } from 'lucide-react';
import { FormField } from '../../components/ui/FormField';
import { Toast, ToastType } from '../../components/ui/Toast';
import { apiService } from '../../services/api.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [modo, setModo] = useState<'cedula' | 'email'>('cedula');

  // Cedula login
  const [cedula, setCedula] = useState('');

  // Email login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const formatCedula = (val: string) => {
    return val.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleLoginCedula = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanCedula = formatCedula(cedula);
    const cedulaRegex = /^\d{13}[A-Z]$/;
    if (!cedulaRegex.test(cleanCedula)) {
      setError('Formato inválido. Ej: 0012508900012A');
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiService.login(cleanCedula);
      showToast('Sesión iniciada correctamente.', 'success');
      setTimeout(() => {
        if (res.candidato.rol === 'admin') {
          navigate('/buscar');
        } else {
          navigate('/solicitud');
        }
      }, 800);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiService.loginEmail(email, password);
      showToast('Sesión iniciada correctamente.', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <LogIn size={40} color="#6366f1" />
          <h2 style={{ margin: '8px 0 4px' }}>Solicitud de Empleo</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Inicia sesión para continuar</p>
        </div>

        {/* Toggle modo */}
        <div style={toggleStyle}>
          <button
            onClick={() => setModo('cedula')}
            style={{ ...tabBtnStyle, ...(modo === 'cedula' ? tabActiveStyle : {}) }}
          >
            Cédula
          </button>
          <button
            onClick={() => setModo('email')}
            style={{ ...tabBtnStyle, ...(modo === 'email' ? tabActiveStyle : {}) }}
          >
            <Mail size={14} style={{ marginRight: 4 }} /> Email
          </button>
        </div>

        {modo === 'cedula' ? (
          <form onSubmit={handleLoginCedula}>
            <FormField
              label="Cédula"
              id="cedula"
              value={cedula}
              onChange={(e: any) => setCedula(e.target.value)}
              required
              placeholder="0012508900012A"
            />
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: -12, marginBottom: 16 }}>
              13 dígitos + letra mayúscula
            </p>
            {error && <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>}
            <button type="submit" style={btnStyle} disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginEmail}>
            <FormField
              label="Correo electrónico"
              id="email"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
            />
            <FormField
              label="Contraseña"
              id="password"
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            {error && <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>}
            <button type="submit" style={btnStyle} disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/registro" style={{ color: '#6366f1', fontSize: 14 }}>
            ¿Tienes un enlace de invitación? Regístrate aquí
          </a>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: 20,
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 16,
  padding: 32,
  width: '100%',
  maxWidth: 420,
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
};

const toggleStyle: React.CSSProperties = {
  display: 'flex',
  background: '#f1f5f9',
  borderRadius: 8,
  padding: 4,
  marginBottom: 20,
};

const tabBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 16px',
  border: 'none',
  background: 'transparent',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tabActiveStyle: React.CSSProperties = {
  background: 'white',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  color: '#6366f1',
  fontWeight: 600,
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 24px',
  background: '#6366f1',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 16,
};
