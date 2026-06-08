import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const SSOHandlerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Iniciando sesión...');

  useEffect(() => {
    const ssoToken = searchParams.get('token');
    if (!ssoToken) {
      setStatus('Token no proporcionado');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    (async () => {
      try {
        const resp = await fetch('/api-solicitud/api/auth/sso-portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ssoToken }),
        });
        const data = await resp.json();
        if (data.status === 'success') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('candidato', JSON.stringify(data.candidato));
          setStatus(`Bienvenido ${data.candidato.nombre || ''}`);
          setTimeout(() => navigate('/dashboard'), 800);
        } else {
          setStatus(data.message || 'Error');
          setTimeout(() => navigate('/login'), 1500);
        }
      } catch {
        setStatus('Error de conexión');
        setTimeout(() => navigate('/login'), 1500);
      }
    })();
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d9488, #059669)',
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{
          width: 48, height: 48, border: '3px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
        }} />
        <div style={{ fontSize: 16, fontWeight: 500, opacity: 0.9 }}>{status}</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};
