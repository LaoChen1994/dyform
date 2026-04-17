import React, { useSyncExternalStore } from 'react';
import { FormSchema, FormField, flattenElements } from 'pdyform-core';
import { useForm, UseFormReturn } from './useForm';
import { FormElementRenderer } from './FormElementRenderer';
import type { FieldComponentMap } from './components';

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (values: Record<string, any>) => void;
  className?: string;
  form?: UseFormReturn;
  componentMap?: FieldComponentMap;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit, className, form: externalForm, componentMap }) => {
  const internalForm = useForm({ schema });
  const form = externalForm || internalForm;
  const { engine } = form;

  // Only subscribe to form-level states (isSubmitting, error tracking for scroll)
  const isSubmitting = useSyncExternalStore(
    (listener) => engine.store.subscribe(listener),
    () => engine.store.getState().isSubmitting
  );
  
  const isAnyFieldValidating = useSyncExternalStore(
    (listener) => engine.store.subscribe(listener),
    () => engine.store.getState().validatingFields.length > 0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { hasError, values, state } = await form.validate();

      if (hasError) {
        const allFields = flattenElements(schema.elements || schema.fields || []);
        // Find the first visible field in schema that has an error
        const firstErrorField = allFields.find((f: FormField) => {
          const isHidden = typeof f.hidden === 'function' ? f.hidden(state.values) : f.hidden;
          return !isHidden && state.errors[f.name];
        });
        
        if (firstErrorField) {
          const element = document.getElementById(`field-${firstErrorField.name}`);
          element?.focus();
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      await onSubmit(values);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ''}`}>
      {schema.title && <h2 className="text-2xl font-bold tracking-tight">{schema.title}</h2>}
      {schema.description && <p className="text-muted-foreground">{schema.description}</p>}
      
      <div className="space-y-4">
        <FormElementRenderer 
          elements={schema.elements || schema.fields || []} 
          form={form} 
          componentMap={componentMap} 
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isAnyFieldValidating}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
        {isSubmitting ? 'Submitting...' : (isAnyFieldValidating ? 'Validating...' : (schema.submitButtonText || 'Submit'))}
      </button>
    </form>
  );
};
