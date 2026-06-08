import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import { FormField } from '../../components/ui/FormField';
import { Toast, ToastType } from '../../components/ui/Toast';
import { apiService } from '../../services/api.service';

export const RegistroPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [yaRegistrado, setYaRegistrado] = useState(false);
  const [candidatoInfo, setCandidatoInfo] = useState<any>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Token de invitación no proporcionado');
      return;
    }
    apiService.validarToken(token)
      .then((res: any) => {
        if (res.yaRegistrado) {
          setYaRegistrado(true);
          setCandidatoInfo(res.candidato);
        } else {
          setValid(true);
          setCandidatoInfo(res.candidato);
        }
      })
      .catch(() => setError('El enlace de invitación es inválido o ha expirado'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await apiService.registro(token, email, password);
      setSuccess(true);
      setToast({ message: 'Registro exitoso. Redirigiendo al login...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  if (loading) return <div style={centerStyle}><p>Validando enlace...</p></div>;

  if (yaRegistrado) return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <CheckCircle size={48} color="#22c55e" />
        <h2>Ya estás registrado</h2>
        <p style={{ color: '#64748b' }}>Hola {candidatoInfo?.nombre || ''}, tu cuenta ya está activa.</p>
        <button onClick={() => navigate('/login')} style={btnStyle}>Iniciar sesión</button>
      </div>
    </div>
  );

  if (error && !valid) return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Enlace inválido</h2>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <p style={{ color: '#64748b' }}>Solicita un nuevo enlace al departamento de Recursos Humanos.</p>
      </div>
    </div>
  );

  if (success) return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <CheckCircle size={48} color="#22c55e" />
        <h2>Registro completado</h2>
        <p style={{ color: '#64748b' }}>Tu cuenta ha sido creada exitosamente.</p>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <UserPlus size={40} color="#6366f1" />
          <h2 style={{ margin: '8px 0 4px' }}>Completa tu registro</h2>
          {candidatoInfo?.nombre && (
            <p style={{ color: '#64748b', fontSize: 14 }}>Bienvenido(a) {candidatoInfo.nombre}</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
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
            placeholder="Mínimo 6 caracteres"
          />
          <FormField
            label="Confirmar contraseña"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repite la contraseña"
          />

          {error && <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>}

          <button type="submit" style={btnStyle}>
            Crear cuenta y continuar
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <a href="/login" style={{ color: '#6366f1', fontSize: 14 }}>Ya tengo cuenta, iniciar sesión</a>
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
  padding: '1.25rem',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-secondary)',
  borderRadius: 'var(--radius-lg)',
  padding: '2rem',
  width: '100%',
  maxWidth: 420,
  boxShadow: 'var(--shadow-premium)',
  border: '1px solid var(--border-color)',
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1.5rem',
  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
  color: 'var(--text-light)',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '1rem',
};

const centerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
