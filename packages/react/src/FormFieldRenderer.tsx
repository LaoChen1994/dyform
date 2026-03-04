import React from 'react';
import { FormField } from 'dyform/core';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field, value, onChange, onBlur, error }) => {
  const { type, label, placeholder, options, description, disabled, name } = field;
  const fieldId = `field-${name}`;

  const baseInputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            className={`${baseInputClasses} min-h-[80px]`}
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            name={name}
          />
        );
      case 'select':
        return (
          <select
            id={fieldId}
            className={baseInputClasses}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            name={name}
          >
            <option value="" disabled>{placeholder || 'Select an option'}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex flex-wrap gap-4">
            {options?.map((opt) => (
              <label key={opt.value} className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(opt.value);
                    } else {
                      const index = newValue.indexOf(opt.value);
                      if (index > -1) newValue.splice(index, 1);
                    }
                    onChange(newValue);
                  }}
                  onBlur={onBlur}
                  disabled={disabled}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="flex flex-wrap gap-4">
            {options?.map((opt) => (
              <label key={opt.value} className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="radio"
                  className="h-4 w-4 border-primary text-primary focus:ring-primary"
                  name={field.name}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  onBlur={onBlur}
                  disabled={disabled}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            id={fieldId}
            type={type}
            className={baseInputClasses}
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            name={name}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${field.className || ''}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      {renderInput()}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
};
