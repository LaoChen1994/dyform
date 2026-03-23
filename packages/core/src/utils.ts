import type { FormField, FormResolver, ValidationRule, ErrorMessageTemplates } from './types';

function parseNumberish(value: unknown): number | null {
  if (typeof value === 'number') return Number.isNaN(value) ? null : value;
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Default error message templates
 */
export const defaultErrorMessages: Required<ErrorMessageTemplates> = {
  required: '{label} is required',
  min: '{label} must be at least {value}',
  max: '{label} must be at most {value}',
  email: 'Invalid email address',
  pattern: 'Invalid format',
  custom: 'Invalid value',
};

/**
 * Helper to replace placeholders like {label}, {value} in error messages
 */
function formatMessage(template: string | undefined, field: FormField, rule: ValidationRule): string {
  if (!template) return '';
  return template
    .replace('{label}', field.label)
    .replace('{value}', String(rule.value || ''));
}

/**
 * Simple get utility for nested objects
 */
export function get(obj: Record<string, unknown> | null | undefined, path: string, defaultValue?: unknown): unknown {
  if (!path) return defaultValue;
  const keys = path.split(/[.[\]]/).filter(Boolean);
  let result: unknown = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }
  return result === undefined ? defaultValue : result;
}

/**
 * Simple set utility for nested objects that returns a new object (immutable)
 */
export function set(obj: Record<string, unknown> | null | undefined, path: string, value: unknown): Record<string, unknown> {
  if (Object(obj) !== obj) return obj as Record<string, unknown>; // When obj is not an object
  const keys = path.split(/[.[\]]/).filter(Boolean);
  const newObj = { ...obj } as Record<string, unknown>;
  let current: Record<string, unknown> = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextKeyIndex = /^\d+$/.test(nextKey);

    if (!(key in current) || current[key] === null || typeof current[key] !== 'object') {
      current[key] = isNextKeyIndex ? [] : {};
    } else {
      current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...(current[key] as Record<string, unknown>) };
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
}

export function normalizeFieldValue(field: FormField, value: unknown): unknown {
  if (field.type !== 'number') return value;

  if (value === '' || value === undefined || value === null) return '';

  const numericValue = parseNumberish(value);
  return numericValue === null ? value : numericValue;
}

export async function validateField(
  value: unknown,
  field: FormField,
  customMessages?: ErrorMessageTemplates
): Promise<string | null> {
  if (!field.validations) return null;

  const messages = { ...defaultErrorMessages, ...customMessages };

  for (const rule of field.validations) {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          return rule.message || formatMessage(messages.required, field, rule);
        }
        break;
      case 'min':
        if (field.type === 'number') {
          const numericValue = parseNumberish(value);
          if (numericValue !== null && numericValue < (rule.value as number)) {
            const template = field.type === 'number' ? messages.min : (typeof value === 'string' ? '{label} must be at least {value} characters' : messages.min);
            return rule.message || formatMessage(template, field, rule);
          }
          break;
        }
        if (typeof value === 'number' && value < (rule.value as number)) {
          return rule.message || formatMessage(messages.min, field, rule);
        }
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          const template = '{label} must be at least {value} characters';
          return rule.message || formatMessage(template, field, rule);
        }
        break;
      case 'max':
        if (field.type === 'number') {
          const numericValue = parseNumberish(value);
          if (numericValue !== null && numericValue > (rule.value as number)) {
            return rule.message || formatMessage(messages.max, field, rule);
          }
          break;
        }
        if (typeof value === 'number' && value > (rule.value as number)) {
          return rule.message || formatMessage(messages.max, field, rule);
        }
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          const template = '{label} must be at most {value} characters';
          return rule.message || formatMessage(template, field, rule);
        }
        break;
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value as string)) {
          return rule.message || formatMessage(messages.email, field, rule);
        }
        break;
      }
      case 'pattern':
        if (value && rule.value && !new RegExp(rule.value as string).test(value as string)) {
          return rule.message || formatMessage(messages.pattern, field, rule);
        }
        break;
      case 'custom':
        if (rule.validator) {
          const result = await rule.validator(value);
          if (typeof result === 'string') return result;
          if (result === false) return rule.message || formatMessage(messages.custom, field, rule);
        }
        break;
    }
  }

  return null;
}

export async function validateFieldByName(
  fields: FormField[],
  name: string,
  value: unknown,
  resolver?: FormResolver,
  allValues?: Record<string, unknown>,
  customMessages?: ErrorMessageTemplates
): Promise<string | null> {
  // 1. Run resolver if provided
  if (resolver && allValues) {
    const resolverErrors = await resolver(allValues);
    if (resolverErrors[name]) return resolverErrors[name];
  }

  // 2. Fallback to field-level validations
  const field = fields.find((f) => f.name === name);
  if (!field) return null;
  return await validateField(value, field, customMessages);
}

export async function validateForm(
  fields: FormField[],
  values: Record<string, unknown>,
  resolver?: FormResolver,
  customMessages?: ErrorMessageTemplates
): Promise<Record<string, string>> {
  let errors: Record<string, string> = {};

  // 1. Run resolver if provided
  if (resolver) {
    errors = await resolver(values);
  }

  // 2. Run field-level validations for fields that don't have errors from resolver yet
  const validationPromises = fields.map(async (field) => {
    if (errors[field.name]) return; // Skip if already has error from resolver

    // Skip hidden fields — they should not be validated
    const isHidden = typeof field.hidden === 'function' ? field.hidden(values) : field.hidden;
    if (isHidden) return;

    const error = await validateField(get(values, field.name), field, customMessages);
    if (error) errors[field.name] = error;
  });

  await Promise.all(validationPromises);
  return errors;
}

export function getDefaultValues(fields: FormField[]): Record<string, unknown> {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : (field.type === 'checkbox' ? [] : '');
    return acc;
  }, {} as Record<string, unknown>);
}
