import React from 'react';
import { Check } from 'lucide-react';

export interface Step { id: number; label: string; }

interface StepWizardProps {
  currentStep: number;
  steps: Step[];
  onStepChange: (stepId: number) => void;
  children: React.ReactNode;
}

export const StepWizard: React.FC<StepWizardProps> = ({ currentStep, steps, children }) => {
  const progress = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
      {/* Steps indicator */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', padding: '1.25rem 1.5rem',
        marginBottom: '1.25rem', boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Mobile step label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Paso {currentStep} de {steps.length}
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
            {progress}%
          </span>
        </div>
        {/* Progress bar */}
        <div style={{
          width: '100%', height: 6, background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 16
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
        {/* Step circles */}
        <div style={{ display: 'flex', gap: 0, justifyContent: 'space-between' }}>
          {steps.map((step, i) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            return (
              <div key={step.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flex: 1, position: 'relative'
              }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 14, left: '50%', right: '-50%',
                    height: 2, background: isCompleted ? 'var(--primary)' : 'var(--bg-muted)',
                    transition: 'background 0.3s'
                  }} />
                )}
                {/* Circle */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, marginBottom: 4,
                  background: isCompleted ? 'var(--primary)'
                    : isActive ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    : 'var(--bg-muted)',
                  color: isCompleted || isActive ? '#fff' : 'var(--text-tertiary)',
                  boxShadow: isActive ? '0 0 0 4px var(--primary-light)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {isCompleted ? <Check size={14} /> : step.id}
                </div>
                {/* Label */}
                <span style={{
                  fontSize: '0.7rem', textAlign: 'center', maxWidth: 70,
                  color: isActive ? 'var(--primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                  fontWeight: isActive ? 600 : 400, display: 'none'
                } as React.CSSProperties}
                  className="step-label">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', padding: '1.5rem',
        boxShadow: 'var(--shadow-xs)', animation: 'slideUp 0.35s ease'
      }}>
        {children}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .step-label { display: block !important; }
        }
      `}</style>
    </div>
  );
};
