import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, HelpCircle } from 'lucide-react';
import { FormField } from '../../components/ui/FormField';
import { Toast, ToastType } from '../../components/ui/Toast';
import { apiService } from '../../services/api.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const formatCedula = (val: string) => {
    // Formatear automáticamente quitando guiones y forzando mayúscula final
    return val.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCedula = formatCedula(cedula);
    
    // Validación regex de cédula
    const cedulaRegex = /^\d{13}[A-Z]$/;
    if (!cedulaRegex.test(cleanCedula)) {
      setError('Formato inválido. Deben ser exactamente 13 dígitos seguidos de una letra mayúscula. Ej: 0012508900012A');
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
      showToast(
        err.response?.data?.message || 'Error al conectar con el servidor.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Encabezado Logo / Título */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <LogIn size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
            Solicitud de Empleo
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Ingresa tu cédula de identidad para iniciar o continuar tu registro.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <FormField
            label="Cédula de Identidad"
            id="cedula-login"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            error={error}
            placeholder="Ej: 0012508900012A"
            required
            maxLength={14}
            disabled={isLoading}
          />

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Ingresar al Portal'}
          </button>
        </form>

        {/* Mensaje Informativo / Instrucciones */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginTop: '2rem',
            textAlign: 'left',
          }}
        >
          <HelpCircle size={18} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            <strong>¿Nuevo registro?</strong> Digita tu cédula y el sistema abrirá un formulario vacío.
            <br />
            <strong>¿Ya registrado?</strong> Ingresa con la misma cédula para consultar o imprimir tu solicitud.
          </p>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};
