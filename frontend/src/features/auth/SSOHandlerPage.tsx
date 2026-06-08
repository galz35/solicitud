import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api.service';

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
        const res = await apiService.ssoPortal(ssoToken);
        setStatus(`Bienvenido ${res.candidato.nombre || ''}`);
        setTimeout(() => navigate('/dashboard'), 1000);
      } catch (e: any) {
        setStatus('Error al iniciar sesión. Redirigiendo...');
        setTimeout(() => navigate('/login'), 2000);
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
