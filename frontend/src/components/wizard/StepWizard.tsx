import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export interface Step {
  id: number;
  label: string;
}

interface StepWizardProps {
  currentStep: number;
  steps: Step[];
  onStepChange: (stepId: number) => void;
  children: React.ReactNode;
  isSubmitting?: boolean;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  currentStep,
  steps,
  onStepChange,
  children,
  isSubmitting = false,
}) => {
  const progressPercent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2rem',
        maxWidth: 'var(--container-max-width)',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
      className="wizard-container"
    >
      {/* Barra Lateral Izquierda: Pasos (Visible en pantallas grandes) */}
      <aside
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-premium)',
          height: 'fit-content',
        }}
        className="wizard-sidebar"
      >
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)' }}>
          Tu Progreso
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <button
                key={step.id}
                disabled={step.id > currentStep} // No saltarse pasos sin validar
                onClick={() => onStepChange(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: isActive
                    ? 'var(--primary-light)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--primary)'
                    : isCompleted
                    ? 'var(--text-secondary)'
                    : 'var(--text-tertiary)',
                  fontWeight: isActive || isCompleted ? 600 : 400,
                  cursor: step.id <= currentStep ? 'pointer' : 'not-allowed',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    backgroundColor: isCompleted
                      ? 'var(--color-success)'
                      : isActive
                      ? 'var(--primary)'
                      : 'var(--bg-tertiary)',
                    color: isCompleted || isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                  }}
                >
                  {isCompleted ? <Check size={14} /> : step.id}
                </span>
                <span style={{ fontSize: '0.875rem' }}>{step.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenedor Principal: Formularios */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Barra de progreso superior y versión móvil de pasos */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-premium)',
          }}
        >
          {/* Cabecera Móvil */}
          <div className="mobile-step-header" style={{ display: 'none', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Paso {currentStep} de {steps.length}
            </span>
            <h3 style={{ fontSize: '1.1rem' }}>
              {steps.find((s) => s.id === currentStep)?.label}
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
            className="progress-label-container"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Completado de la Solicitud
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
              {progressPercent}%
            </span>
          </div>
          {/* Barra de Progreso */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                borderRadius: 'var(--radius-full)',
                transition: 'width var(--transition-normal) ease-in-out',
              }}
            />
          </div>
        </div>

        {/* Renderizado de la Sección del Paso Actual */}
        <div className="card" style={{ flex: 1 }}>
          {children}
        </div>
      </main>

      {/* Estilos responsivos usando CSS embebido */}
      <style>{`
        @media (max-width: 768px) {
          .wizard-container {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            padding: 1rem 0.5rem !important;
          }
          .wizard-sidebar {
            display: none !important;
          }
          .mobile-step-header {
            display: block !important;
          }
          .progress-label-container {
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};
