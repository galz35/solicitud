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
  const [info, setInfo] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (!token) { setLoading(false); setError('Token no proporcionado'); return; }
    apiService.validarToken(token)
      .then((res: any) => {
        if (res.yaRegistrado) { setYaRegistrado(true); setInfo(res.candidato); }
        else { setValid(true); setInfo(res.candidato); }
      })
      .catch(() => setError('Enlace inválido o expirado'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return; }
    try {
      await apiService.registro(token, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) { setError(err.response?.data?.message || 'Error al registrarse'); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d9488, #059669)' }}>
      <div style={{ color: '#fff', fontSize: 16 }}>⏳ Validando enlace...</div>
    </div>
  );

  if (yaRegistrado) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d9488, #059669)', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
        <CheckCircle size={48} color="#10b981" style={{ marginBottom: 12 }} />
        <h2 style={{ margin: '0 0 8px' }}>Ya estás registrado</h2>
        <p style={{ color: '#666', marginBottom: 20 }}>Hola {info?.nombre || ''}, tu cuenta ya está activa.</p>
        <button onClick={() => navigate('/login')}
          style={{ padding: '10px 24px', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Iniciar sesión
        </button>
      </div>
    </div>
  );

  if (error && !valid) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d9488, #059669)', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔗</div>
        <h2 style={{ margin: '0 0 8px' }}>Enlace inválido</h2>
        <p style={{ color: '#ef4444', marginBottom: 8 }}>{error}</p>
        <p style={{ color: '#666', fontSize: 13 }}>Solicita un nuevo enlace a Recursos Humanos.</p>
      </div>
    </div>
  );

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d9488, #059669)', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
        <CheckCircle size={48} color="#10b981" style={{ marginBottom: 12 }} />
        <h2 style={{ margin: '0 0 8px' }}>Registro completado ✅</h2>
        <p style={{ color: '#666' }}>Redirigiendo al inicio de sesión...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d9488, #059669)', padding: 20 }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderRadius: 24, padding: '2rem 1.75rem', maxWidth: 420, width: '100%',
        boxShadow: '0 24px 48px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #0d9488, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', boxShadow: '0 8px 16px rgba(13,148,136,0.25)'
          }}>
            <UserPlus size={24} color="#fff" />
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, color: '#1a1a1a' }}>Completa tu registro</h2>
          {info?.nombre && <p style={{ color: '#666', fontSize: 13 }}>Bienvenido(a) {info.nombre}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <FormField label="Correo electrónico" id="email" type="email" value={email}
            onChange={(e: any) => setEmail(e.target.value)} required placeholder="tu@correo.com" />
          <FormField label="Contraseña" id="password" type="password" value={password}
            onChange={(e: any) => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" />
          <FormField label="Confirmar contraseña" id="confirm" type="password" value={confirm}
            onChange={(e: any) => setConfirm(e.target.value)} required placeholder="Repite la contraseña" />
          {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}
          <button type="submit"
            style={{
              width: '100%', padding: '12px 24px', border: 'none', borderRadius: 12,
              background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
            }}>
            Crear cuenta y continuar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/login" style={{ color: '#0d9488', fontSize: 13, fontWeight: 500 }}>
            Ya tengo cuenta, iniciar sesión →
          </a>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
