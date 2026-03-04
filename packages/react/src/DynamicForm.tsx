import React, { useState } from 'react';
import { FormSchema, validateField, getDefaultValues } from 'dyform/core';
import { FormFieldRenderer } from './FormFieldRenderer';

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (values: Record<string, any>) => void;
  className?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit, className }) => {
  const [values, setValues] = useState<Record<string, any>>(getDefaultValues(schema.fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change
    const field = schema.fields.find(f => f.name === name);
    if (field) {
      const error = validateField(value, field);
      setErrors((prev) => ({
        ...prev,
        [name]: error || ''
      }));
    }
  };

  const handleFieldBlur = (name: string) => {
    const field = schema.fields.find(f => f.name === name);
    if (field) {
      const error = validateField(values[name], field);
      setErrors((prev) => ({
        ...prev,
        [name]: error || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};
    let hasError = false;

    schema.fields.forEach((field) => {
      const error = validateField(values[field.name], field);
      if (error) {
        newErrors[field.name] = error;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (!hasError) {
      onSubmit(values);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ''}`}>
      {schema.title && <h2 className="text-2xl font-bold tracking-tight">{schema.title}</h2>}
      {schema.description && <p className="text-muted-foreground">{schema.description}</p>}
      
      <div className="space-y-4">
        {schema.fields.map((field) => (
          !field.hidden && (
            <FormFieldRenderer
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(val) => handleFieldChange(field.name, val)}
              onBlur={() => handleFieldBlur(field.name)}
              error={errors[field.name]}
            />
          )
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
        {isSubmitting ? 'Submitting...' : (schema.submitButtonText || 'Submit')}
      </button>
    </form>
  );
};
