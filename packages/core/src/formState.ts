import type { FormField, FormResolver, ErrorMessageTemplates, FormSchema } from './types';
import { getDefaultValues, normalizeFieldValue, validateFieldByName, validateForm, get, set as setPathValue, flattenElements } from './utils';

// --- Base Store Engine ---
export type StoreListener<T> = (state: T, prevState: T) => void;

export interface VanillaStore<T> {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: StoreListener<T>) => () => void;
}

export function createStore<T>(initialState: T): VanillaStore<T> {
  let state = initialState;
  const listeners = new Set<StoreListener<T>>();

  const getState = () => state;

  const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const prevState = state;
      state = { ...state, ...nextState };
      listeners.forEach((listener) => listener(state, prevState));
    }
  };

  const subscribe = (listener: StoreListener<T>) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
}

// --- Form Engine (Business Logic) ---
export interface FormRuntimeState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  validatingFields: string[];
  isSubmitting: boolean;
  fieldProps: Record<string, Partial<FormField>>;
}

export type FieldChangeContext = {
  value: unknown;
  engine: FormEngine;
};

export interface FormEngine {
  store: VanillaStore<FormRuntimeState>;
  setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
  setFieldBlur: (name: string) => Promise<void>;
  setSubmitting: (isSubmitting: boolean) => void;
  runSubmitValidation: () => Promise<{ state: FormRuntimeState; hasError: boolean }>;
  setFieldProps: (name: string, props: Partial<FormField>) => void;
  subscribeToChange: (name: string, listener: (context: FieldChangeContext) => void) => () => void;
}

export function createFormEngine(
  schemaOrFields: FormField[] | FormSchema,
  resolver?: FormResolver,
  errorMessages?: ErrorMessageTemplates
): FormEngine {
  const isSchema = schemaOrFields && !Array.isArray(schemaOrFields);
  const schema = isSchema ? (schemaOrFields as FormSchema) : undefined;
  
  const fields: FormField[] = Array.isArray(schemaOrFields) 
    ? schemaOrFields 
    : (schema?.elements ? flattenElements(schema.elements) : (schema?.fields || []));

  const store = createStore<FormRuntimeState>({
    values: getDefaultValues(fields),
    errors: {},
    touched: {},
    validatingFields: [],
    isSubmitting: false,
    fieldProps: {},
  });

  const { getState, setState } = store;
  const changeListeners: Record<string, Set<(context: FieldChangeContext) => void>> = {};

  const subscribeToChange = (name: string, listener: (context: FieldChangeContext) => void) => {
    if (!changeListeners[name]) changeListeners[name] = new Set();
    changeListeners[name].add(listener);
    return () => changeListeners[name].delete(listener);
  };

  const setFieldProps = (name: string, props: Partial<FormField>) => {
    setState((s) => ({
      fieldProps: {
        ...s.fieldProps,
        [name]: {
          ...s.fieldProps[name],
          ...props,
        },
      },
    }));
  };

  const setFieldValue = async (name: string, rawValue: unknown) => {
    const field = fields.find((f) => f.name === name);
    const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;

    setState((s) => ({
      values: setPathValue(s.values, name, normalizedValue),
      touched: { ...s.touched, [name]: true },
    }));

    const hasExistingError = !!getState().errors[name];
    const shouldValidateImmediately = field && ['select', 'checkbox', 'radio', 'switch', 'date'].includes(field.type);

    if (shouldValidateImmediately || hasExistingError) {
      setState((s) => ({
        validatingFields: [...s.validatingFields, name],
      }));

      try {
        const currentValues = getState().values;
        const error = await validateFieldByName(fields, name, normalizedValue, resolver, currentValues, errorMessages);
        setState((s) => ({
          errors: { ...s.errors, [name]: error || '' },
          validatingFields: s.validatingFields.filter((f) => f !== name),
        }));
      } catch {
        setState((s) => ({
          validatingFields: s.validatingFields.filter((f) => f !== name),
        }));
      }
    }

    // Trigger side effects
    if (changeListeners[name] && engine) {
      changeListeners[name].forEach((listener) => listener({ value: normalizedValue, engine }));
    }

    // Validate dependent fields automatically
    const dependentFields = fields.filter((f) => f.dependencies?.includes(name));
    for (const df of dependentFields) {
      const dfValue = get(getState().values, df.name);
      validateFieldByName(fields, df.name, dfValue, resolver, getState().values, errorMessages)
        .then((err) => {
          setState((s) => ({
            errors: { ...s.errors, [df.name]: err || '' },
          }));
        })
        .catch(() => {});
    }
  };

  const setFieldBlur = async (name: string) => {
    setState((s) => ({
      validatingFields: [...s.validatingFields, name],
      touched: { ...s.touched, [name]: true },
    }));

    try {
      const currentValues = getState().values;
      const value = get(currentValues, name);
      const error = await validateFieldByName(fields, name, value, resolver, currentValues, errorMessages);
      setState((s) => ({
        errors: { ...s.errors, [name]: error || '' },
        validatingFields: s.validatingFields.filter((f) => f !== name),
      }));
    } catch {
      setState((s) => ({
        validatingFields: s.validatingFields.filter((f) => f !== name),
      }));
    }
  };

  const setSubmitting = (isSubmitting: boolean) => setState({ isSubmitting });

  const runSubmitValidation = async () => {
    setState({ isSubmitting: true });
    const currentValues = getState().values;
    const errors = await validateForm(fields, currentValues, resolver, errorMessages);
    const hasError = Object.keys(errors).length > 0;

    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setState((s) => ({
      errors,
      touched: { ...s.touched, ...allTouched },
      isSubmitting: false,
    }));

    return {
      state: getState(),
      hasError,
    };
  };

  const engine: FormEngine = {
    store,
    setFieldValue,
    setFieldBlur,
    setSubmitting,
    runSubmitValidation,
    setFieldProps,
    subscribeToChange,
  };

  if (schema?.effects) {
    schema.effects(engine);
  }

  return engine;
}
