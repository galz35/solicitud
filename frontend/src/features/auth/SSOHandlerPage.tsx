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
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const handleSSO = async () => {
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
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setStatus(data.message || 'Error de autenticación');
          setTimeout(() => navigate('/login'), 1500);
        }
      } catch {
        setStatus('Error de conexión');
        setTimeout(() => navigate('/login'), 1500);
      }
    };
    handleSSO();
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
      color: 'white',
      fontSize: '1.2rem',
      fontFamily: '"Inter", sans-serif',
    }}>
      {status}
    </div>
  );
};
