import React from 'react';
import { Check, ChevronLeft, ChevronRight, Save } from 'lucide-react';

export interface Step { id: number; label: string; description?: string; }

interface StepWizardProps {
  currentStep: number;
  steps: Step[];
  onStepChange: (stepId: number) => void;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isSaving?: boolean;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  currentStep, steps, children, onNext, onBack, isFirst, isLast, isSaving, onStepChange
}) => {
  const progress = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);
  const current = steps.find(s => s.id === currentStep);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Steps indicator */}
      <div style={{
        background: '#fff', borderRadius: 16,
        border: '1px solid #e4e7ec', padding: '20px 24px',
        marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }} className="wiz-progress">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>
            Paso {currentStep} de {steps.length}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0d9488' }}>
            {current?.label} · {progress}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%', height: 5, background: '#f0f0f0',
          borderRadius: 10, overflow: 'hidden', marginBottom: 16
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #0d9488, #059669)',
            borderRadius: 10, transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Step circles */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="wiz-steps">
          {steps.map((step, i) => {
            const done = step.id < currentStep;
            const active = step.id === currentStep;
            return (
              <div key={step.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flex: 1, position: 'relative', cursor: step.id <= currentStep ? 'pointer' : 'default'
              }} onClick={() => step.id <= currentStep && onStepChange?.(step.id)}>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 14, left: '50%', right: '-50%',
                    height: 2, background: done ? '#0d9488' : '#e4e7ec', transition: 'background 0.3s'
                  }} />
                )}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, marginBottom: 6,
                  background: done ? '#0d9488' : active ? 'linear-gradient(135deg,#0d9488,#059669)' : '#f5f5f5',
                  color: done || active ? '#fff' : '#bbb',
                  boxShadow: active ? '0 0 0 4px rgba(13,148,136,0.12)' : 'none',
                  transition: 'all 0.3s ease'
                }} className="wiz-step-circle">
                  {done ? <Check size={12} /> : step.id}
                </div>
                <span style={{
                  fontSize: 10, textAlign: 'center', color: active ? '#0d9488' : done ? '#555' : '#bbb',
                  fontWeight: active ? 600 : 400, lineHeight: 1.2, maxWidth: 60
                }} className="wiz-step-label">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step description */}
      {current?.description && (
        <div style={{
          background: '#f0fdf4', borderRadius: 10, padding: '10px 16px',
          marginBottom: 16, border: '1px solid #bbf7d0', fontSize: 13, color: '#166534'
        }} className="wiz-desc">
          💡 {current.description}
        </div>
      )}

      {/* Content */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e4e7ec',
        padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        animation: 'slideUp 0.3s ease', minHeight: 300
      }} className="wiz-content">
        {children}
      </div>

      {/* Navigation */}
      {(onNext || onBack) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 12
        }} className="wiz-nav">
          <button onClick={onBack} disabled={isFirst}
            style={{
              padding: '10px 22px', border: '1.5px solid #e4e7ec', borderRadius: 10,
              background: '#fff', color: '#555', cursor: isFirst ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 500, opacity: isFirst ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
            <ChevronLeft size={16} /> Anterior
          </button>
          <button onClick={onNext} disabled={isSaving}
            style={{
              padding: '10px 22px', border: 'none', borderRadius: 10,
              background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              opacity: isSaving ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(13,148,136,0.25)'
            }}>
            {isSaving ? <><Save size={14} /> Guardando...</> : isLast ? '✅ Finalizar' : <>Siguiente <ChevronRight size={16} /></>}
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .wiz-steps { gap: 2px !important; }
          .wiz-step-label { display: none !important; }
          .wiz-step-circle { width: 22px !important; height: 22px !important; font-size: 9px !important; margin-bottom: 0 !important; }
          .wiz-progress { padding: 12px 14px !important; }
          .wiz-content { padding: 16px !important; }
          .wiz-nav button { padding: 10px 14px !important; font-size: 12px !important; }
          .wiz-desc { font-size: 12px !important; padding: 8px 12px !important; }
        }
      `}</style>
    </div>
  );
};
