import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  as?: 'input' | 'select' | 'textarea';
  children?: React.ReactNode;
  rows?: number;
}

export const FormField = React.forwardRef<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, required, as = 'input', children, id, className = '', style, ...props }, ref) => {
    const Component = as as any;
    const hasError = !!error;

    return (
      <div style={{ marginBottom: '1.25rem', ...style }} className={className}>
        <label htmlFor={id} style={{
          display: 'block', fontSize: '0.8125rem', fontWeight: 600,
          color: hasError ? 'var(--error)' : 'var(--text-secondary)',
          marginBottom: '0.375rem', transition: 'color var(--transition-fast)'
        }}>
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>}
        </label>
        {as === 'select' ? (
          <select
            id={id}
            ref={ref as any}
            style={{
              width: '100%', padding: '0.625rem 0.875rem',
              border: `1.5px solid ${hasError ? 'var(--error)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', fontSize: '0.925rem',
              background: 'var(--bg-card)', color: 'var(--text)',
              outline: 'none', transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              appearance: 'none', cursor: 'pointer',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center',
              paddingRight: '2rem'
            }}
            {...props}
          >
            {children}
          </select>
        ) : as === 'textarea' ? (
          <textarea
            id={id}
            ref={ref as any}
            rows={props.rows || 3}
            style={{
              width: '100%', padding: '0.625rem 0.875rem',
              border: `1.5px solid ${hasError ? 'var(--error)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', fontSize: '0.925rem',
              background: 'var(--bg-card)', color: 'var(--text)',
              outline: 'none', transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              resize: 'vertical', minHeight: 80,
              ...((props as any).style || {})
            }}
            {...props}
          />
        ) : (
          <input
            id={id}
            ref={ref as any}
            style={{
              width: '100%', padding: '0.625rem 0.875rem',
              border: `1.5px solid ${hasError ? 'var(--error)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', fontSize: '0.925rem',
              background: 'var(--bg-card)', color: 'var(--text)',
              outline: 'none', transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              ...((props as any).style || {})
            }}
            {...props}
          />
        )}
        {hasError && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);
