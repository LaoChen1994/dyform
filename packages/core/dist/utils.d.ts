import { ErrorMessageTemplates, FormField, FormResolver } from './types.js';

/**
 * Default error message templates
 */
declare const defaultErrorMessages: Required<ErrorMessageTemplates>;
/**
 * Simple get utility for nested objects
 */
declare function get(obj: any, path: string, defaultValue?: any): any;
/**
 * Simple set utility for nested objects that returns a new object (immutable)
 */
declare function set(obj: any, path: string, value: any): any;
declare function normalizeFieldValue(field: FormField, value: unknown): unknown;
declare function validateField(value: any, field: FormField, customMessages?: ErrorMessageTemplates): Promise<string | null>;
declare function validateFieldByName(fields: FormField[], name: string, value: unknown, resolver?: FormResolver, allValues?: any, customMessages?: ErrorMessageTemplates): Promise<string | null>;
declare function validateForm(fields: FormField[], values: Record<string, any>, resolver?: FormResolver, customMessages?: ErrorMessageTemplates): Promise<Record<string, string>>;
declare function getDefaultValues(fields: FormField[]): Record<string, any>;

export { defaultErrorMessages, get, getDefaultValues, normalizeFieldValue, set, validateField, validateFieldByName, validateForm };
