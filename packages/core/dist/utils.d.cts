import { ErrorMessageTemplates, FormField, FormResolver } from './types.cjs';

/**
 * Default error message templates
 */
declare const defaultErrorMessages: Required<ErrorMessageTemplates>;
/**
 * Simple get utility for nested objects
 */
declare function get(obj: Record<string, unknown> | null | undefined, path: string, defaultValue?: unknown): unknown;
/**
 * Simple set utility for nested objects that returns a new object (immutable)
 */
declare function set(obj: Record<string, unknown> | null | undefined, path: string, value: unknown): Record<string, unknown>;
declare function normalizeFieldValue(field: FormField, value: unknown): unknown;
declare function validateField(value: unknown, field: FormField, customMessages?: ErrorMessageTemplates): Promise<string | null>;
declare function validateFieldByName(fields: FormField[], name: string, value: unknown, resolver?: FormResolver, allValues?: Record<string, unknown>, customMessages?: ErrorMessageTemplates): Promise<string | null>;
declare function validateForm(fields: FormField[], values: Record<string, unknown>, resolver?: FormResolver, customMessages?: ErrorMessageTemplates): Promise<Record<string, string>>;
declare function getDefaultValues(fields: FormField[]): Record<string, unknown>;

export { defaultErrorMessages, get, getDefaultValues, normalizeFieldValue, set, validateField, validateFieldByName, validateForm };
