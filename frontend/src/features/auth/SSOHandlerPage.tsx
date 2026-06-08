import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api.service';

export const SSOHandlerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Token no proporcionado');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Decodificar el token JWT del portal (solo lectura, no verificación)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const cedula = payload.carnet || payload.username || payload.sub;

      // Guardar en localStorage como si fuera login manual
      localStorage.setItem('token', token);
      localStorage.setItem('candidato', JSON.stringify({
        cedula,
        email: payload.correo || '',
        nombre: payload.name || '',
        existe: true,
        apps: payload.apps || [],
      }));

      setStatus(`Bienvenido ${payload.name || ''}`);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (e) {
      setStatus('Error al procesar el token');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.2rem',
      fontFamily: '"Inter", sans-serif',
    }}>
      {status}
    </div>
  );
};
