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
  ({ label, error, required, as = 'input', children, id, className = '', ...props }, ref) => {
    const Component = as as any;
    
    return (
      <div style={{ marginBottom: '1.25rem' }} className={className}>
        <label 
          htmlFor={id} 
          style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            color: 'var(--text-secondary)',
            marginBottom: '0.375rem'
          }}
        >
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
        
        <Component
          id={id}
          ref={ref}
          style={{
            borderColor: error ? 'var(--color-error)' : 'var(--border-color)',
            boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : undefined
          }}
          {...props}
        >
          {children}
        </Component>
        
        {error && (
          <p 
            style={{ 
              color: 'var(--color-error)', 
              fontSize: '0.75rem', 
              marginTop: '0.25rem',
              fontWeight: 500
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
