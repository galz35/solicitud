import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail } from 'lucide-react';
import { FormField } from '../../components/ui/FormField';
import { Toast, ToastType } from '../../components/ui/Toast';
import { apiService } from '../../services/api.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [modo, setModo] = useState<'cedula' | 'email'>('cedula');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [cedulaLogin, setCedulaLogin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fmt = (v: string) => v.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  const show = (msg: string, type: ToastType) => setToast({ message: msg, type });

  const handleCedula = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const c = fmt(cedula);
    if (!/^\d{13}[A-Z]$/.test(c)) { setError('Formato: 13 dígitos + letra'); return; }
    setIsLoading(true);
    try {
      const res = await apiService.login(c);
      show('Sesión iniciada ✅', 'success');
      setTimeout(() => navigate(res.candidato.rol === 'admin' ? '/admin' : '/dashboard'), 800);
    } catch (err: any) { setError(err.response?.data?.message || 'Error'); }
    finally { setIsLoading(false); }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!email || !cedulaLogin) { setError('Completa todos los campos'); return; }
    setIsLoading(true);
    try {
      const res = await apiService.loginEmailCedula(email, fmt(cedulaLogin));
      show('Sesión iniciada ✅', 'success');
      setTimeout(() => navigate(res.candidato.rol === 'admin' ? '/admin' : '/dashboard'), 800);
    } catch (err: any) { setError(err.response?.data?.message || 'Credenciales incorrectas'); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0d9488 0%, #059669 50%, #047857 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

      <div style={{
        margin: 'auto', width: '100%', maxWidth: 420, padding: '1.25rem', position: 'relative', zIndex: 1
      }}>
        {/* Glass card */}
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
          borderRadius: 24, padding: '2rem 1.75rem',
          boxShadow: '0 24px 48px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #0d9488, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', boxShadow: '0 8px 16px rgba(13,148,136,0.25)'
            }}>
              <LogIn size={24} color="#fff" />
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, color: '#1a1a1a' }}>Solicitud de Empleo</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Inicia sesión para continuar</p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', background: '#f5f5f5', borderRadius: 12, padding: 3, marginBottom: 24
          }}>
            {[
              { id: 'cedula', label: 'Cédula' },
              { id: 'email', label: 'Email + Cédula' },
            ].map(t => (
              <button key={t.id} onClick={() => setModo(t.id as any)}
                style={{
                  flex: 1, padding: '8px 12px', border: 'none', borderRadius: 10,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: modo === t.id ? '#fff' : 'transparent',
                  color: modo === t.id ? '#0d9488' : '#666',
                  boxShadow: modo === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s'
                }}>
                {t.id === 'cedula' ? '🪪' : '📧'} {t.label}
              </button>
            ))}
          </div>

          {modo === 'cedula' ? (
            <form onSubmit={handleCedula}>
              <FormField label="Cédula de Identidad" id="cedula" value={cedula}
                onChange={(e: any) => setCedula(e.target.value)} required placeholder="0012508900012A" />
              <p style={{ fontSize: 11, color: '#aaa', marginTop: -12, marginBottom: 16 }}>
                13 dígitos + letra mayúscula
              </p>
              {error && <p style={{ color: 'var(--error)', fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}
              <button type="submit" disabled={isLoading}
                style={{
                  width: '100%', padding: '12px 24px', border: 'none', borderRadius: 12,
                  background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
                  transition: 'all 0.2s', opacity: isLoading ? 0.7 : 1
                }}>
                {isLoading ? '⏳ Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmail}>
              <FormField label="Correo electrónico" id="email" type="email" value={email}
                onChange={(e: any) => setEmail(e.target.value)} required placeholder="tu@correo.com" />
              <FormField label="Cédula" id="cedulaLogin" value={cedulaLogin}
                onChange={(e: any) => setCedulaLogin(fmt(e.target.value))} required placeholder="0012508900012A" />
              {error && <p style={{ color: 'var(--error)', fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}
              <button type="submit" disabled={isLoading}
                style={{
                  width: '100%', padding: '12px 24px', border: 'none', borderRadius: 12,
                  background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
                  transition: 'all 0.2s', opacity: isLoading ? 0.7 : 1
                }}>
                {isLoading ? '⏳ Entrando...' : 'Iniciar sesión'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/registro"
              style={{ color: '#0d9488', fontSize: 13, fontWeight: 500 }}>
              ¿Tienes un enlace de invitación? Regístrate aquí →
            </a>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
