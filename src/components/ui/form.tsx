'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

// Form Context
interface FormContextValue {
  errors: Record<string, string>;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form');
  }
  return context;
}

// Form Root
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function Form({ children, onSubmit, ...props }: FormProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const setError = React.useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearError = React.useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = React.useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    clearAllErrors();
    onSubmit?.(e);
  };

  return (
    <FormContext.Provider value={{ errors, setError, clearError, clearAllErrors }}>
      <form onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// Form Field
interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  name,
  label,
  description,
  required,
  children,
  className,
}: FormFieldProps) {
  const { errors } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Form Section
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// Form Row (for horizontal layout)
interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2', className)}>
      {children}
    </div>
  );
}

// Form Actions
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex gap-2 pt-4',
        align === 'left' && 'justify-start',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className
      )}
    >
      {children}
    </div>
  );
}

// Fieldset
interface FieldsetProps {
  legend?: string;
  children: React.ReactNode;
  className?: string;
}

export function Fieldset({ legend, children, className }: FieldsetProps) {
  return (
    <fieldset className={cn('space-y-4 rounded-lg border p-4', className)}>
      {legend && (
        <legend className="px-2 text-sm font-medium">{legend}</legend>
      )}
      {children}
    </fieldset>
  );
}

// Form Error Summary
interface FormErrorSummaryProps {
  errors?: Record<string, string>;
  className?: string;
}

export function FormErrorSummary({ errors: propErrors, className }: FormErrorSummaryProps) {
  const context = React.useContext(FormContext);
  const errors = propErrors || context?.errors || {};
  const errorMessages = Object.values(errors).filter(Boolean);

  if (errorMessages.length === 0) return null;

  return (
    <div className={cn('rounded-md border border-destructive/50 bg-destructive/10 p-4', className)}>
      <h4 className="text-sm font-medium text-destructive">
        Er zijn {errorMessages.length} fout(en) gevonden
      </h4>
      <ul className="mt-2 list-inside list-disc text-sm text-destructive">
        {errorMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

// Re-export useFormContext
export { useFormContext };
