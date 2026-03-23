import React from 'react';
import { FormSchema, get, FormField } from 'pdyform-core';
import { FormFieldRenderer } from './FormFieldRenderer';
import { useForm, UseFormReturn } from './useForm';

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (values: Record<string, any>) => void;
  className?: string;
  form?: UseFormReturn;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit, className, form: externalForm }) => {
  const internalForm = useForm({ schema });
  const form = externalForm || internalForm;
  const { state: formState, engine } = form;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { hasError, values, state } = await form.validate();

      console.log('has error =>', hasError, values, state)
      
      if (hasError) {
        // Find the first visible field in schema that has an error
        const firstErrorField = schema.fields.find((f: FormField) => {
          const isHidden = typeof f.hidden === 'function' ? f.hidden(formState.values) : f.hidden;
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

  const isAnyFieldValidating = formState.validatingFields.length > 0;

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ''}`}>
      {schema.title && <h2 className="text-2xl font-bold tracking-tight">{schema.title}</h2>}
      {schema.description && <p className="text-muted-foreground">{schema.description}</p>}
      
      <div className="space-y-4">
        {schema.fields.map((field: FormField) => {
          const isHidden = typeof field.hidden === 'function' ? field.hidden(formState.values) : field.hidden;
          const isDisabled = typeof field.disabled === 'function' ? field.disabled(formState.values) : field.disabled;
          const isValidating = formState.validatingFields.includes(field.name);

          return (
            !isHidden && (
              <FormFieldRenderer
                key={field.name}
                field={{ ...field, disabled: isDisabled || isValidating }}
                value={get(formState.values, field.name)}
                onChange={(val) => engine.setFieldValue(field.name, val)}
                onBlur={() => engine.setFieldBlur(field.name)}
                error={formState.errors[field.name]}
              />
            )
          );
        })}
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting || isAnyFieldValidating}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
        {formState.isSubmitting ? 'Submitting...' : (isAnyFieldValidating ? 'Validating...' : (schema.submitButtonText || 'Submit'))}
      </button>
    </form>
  );
};

