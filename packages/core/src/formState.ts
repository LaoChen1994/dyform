import type { FormField, FormResolver, ErrorMessageTemplates } from './types';
import { getDefaultValues, normalizeFieldValue, validateFieldByName, validateForm, get, set as setPathValue } from './utils';

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
  validatingFields: string[];
  isSubmitting: boolean;
}

export interface FormEngine {
  store: VanillaStore<FormRuntimeState>;
  setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
  setFieldBlur: (name: string) => Promise<void>;
  setSubmitting: (isSubmitting: boolean) => void;
  runSubmitValidation: () => Promise<{ state: FormRuntimeState; hasError: boolean }>;
}

export function createFormEngine(
  fields: FormField[],
  resolver?: FormResolver,
  errorMessages?: ErrorMessageTemplates
): FormEngine {
  const store = createStore<FormRuntimeState>({
    values: getDefaultValues(fields),
    errors: {},
    validatingFields: [],
    isSubmitting: false,
  });

  const { getState, setState } = store;

  const setFieldValue = async (name: string, rawValue: unknown) => {
    const field = fields.find((f) => f.name === name);
    const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;

    setState((s) => ({
      values: setPathValue(s.values, name, normalizedValue),
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
  };

  const setFieldBlur = async (name: string) => {
    setState((s) => ({
      validatingFields: [...s.validatingFields, name],
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

    setState({
      errors,
      isSubmitting: false,
    });

    return {
      state: getState(),
      hasError,
    };
  };

  return {
    store,
    setFieldValue,
    setFieldBlur,
    setSubmitting,
    runSubmitValidation,
  };
}
