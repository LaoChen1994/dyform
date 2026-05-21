import type { FormField, FormResolver, ErrorMessageTemplates, FormSchema, ValidateOn } from './types';
import { getDefaultValues, normalizeFieldValue, validateFieldByName, validateForm, get, set as setPathValue, flattenElements, flattenElementsWithValues } from './utils';
import { evaluateExpression } from './expression';

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
  computedStates: Record<string, { hidden: boolean; disabled: boolean }>;
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
  runSubmitValidation: () => Promise<{ state: FormRuntimeState; hasError: boolean; values: Record<string, unknown> }>;
  resetForm: () => void;
  setFieldProps: (name: string, props: Partial<FormField>) => void;
  subscribeToChange: (name: string, listener: (context: FieldChangeContext) => void) => () => void;
  appendListItem: (name: string, defaultVal?: unknown) => void;
  removeListItem: (name: string, index: number) => void;
}

export function createFormEngine(
  schemaOrFields: FormField[] | FormSchema,
  resolver?: FormResolver,
  errorMessages?: ErrorMessageTemplates
): FormEngine {
  const isSchema = schemaOrFields && !Array.isArray(schemaOrFields);
  const schema = isSchema ? (schemaOrFields as FormSchema) : undefined;
  
  const formValidateOn = schema?.validateOn;
  const hiddenFieldStrategy = schema?.hiddenFieldStrategy || 'keep';

  const getActiveFields = (values: Record<string, unknown>): FormField[] => {
    if (Array.isArray(schemaOrFields)) return schemaOrFields;
    if (schema?.elements) {
      return flattenElementsWithValues(schema.elements, values);
    }
    return schema?.fields || [];
  };

  const evaluateDynamicProps = (
    values: Record<string, unknown>,
    fieldProps: Record<string, Partial<FormField>>,
    currentComputed: Record<string, { hidden: boolean; disabled: boolean }>
  ) => {
    const nextComputed = { ...currentComputed };
    let changed = false;
    const currentFields = getActiveFields(values);

    for (const field of currentFields) {
      const runtimeProps = fieldProps[field.name] || {};
      
      const hiddenDef = runtimeProps.hidden !== undefined ? runtimeProps.hidden : field.hidden;
      let nextHidden = false;
      if (typeof hiddenDef === 'function') {
        nextHidden = hiddenDef(values);
      } else if (typeof hiddenDef === 'string') {
        nextHidden = evaluateExpression(hiddenDef, { values });
      } else if (hiddenDef !== undefined) {
        nextHidden = !!hiddenDef;
      }

      const disabledDef = runtimeProps.disabled !== undefined ? runtimeProps.disabled : field.disabled;
      let nextDisabled = false;
      if (typeof disabledDef === 'function') {
        nextDisabled = disabledDef(values);
      } else if (typeof disabledDef === 'string') {
        nextDisabled = evaluateExpression(disabledDef, { values });
      } else if (disabledDef !== undefined) {
        nextDisabled = !!disabledDef;
      }

      const prev = nextComputed[field.name];
      if (!prev || prev.hidden !== nextHidden || prev.disabled !== nextDisabled) {
        nextComputed[field.name] = { hidden: nextHidden, disabled: nextDisabled };
        changed = true;
      }
    }

    return { nextComputed, changed };
  };

  const getInitialValues = (): Record<string, unknown> => {
    if (schema?.elements) {
      const initVals: Record<string, unknown> = {};
      const fill = (elts: import('./types').FormElement[], target: Record<string, unknown>) => {
        for (const el of elts) {
          if (el.nodeType === 'group' || el.nodeType === 'grid') {
            fill(el.elements, target);
          } else if (el.nodeType === 'list') {
            target[el.name] = el.defaultValue !== undefined ? el.defaultValue : [];
          } else {
            const f = el as FormField;
            target[f.name] = f.defaultValue !== undefined ? f.defaultValue : (f.type === 'checkbox' ? [] : '');
          }
        }
      };
      fill(schema.elements, initVals);
      return initVals;
    }
    const fallbackFields = Array.isArray(schemaOrFields) ? schemaOrFields : (schema?.fields || []);
    return getDefaultValues(fallbackFields);
  };

  const initialValues = getInitialValues();
  const initialFieldProps = {};
  const { nextComputed: initialComputed } = evaluateDynamicProps(initialValues, initialFieldProps, {});

  const store = createStore<FormRuntimeState>({
    values: initialValues,
    errors: {},
    touched: {},
    validatingFields: [],
    isSubmitting: false,
    fieldProps: initialFieldProps,
    computedStates: initialComputed,
  });

  const { getState, setState } = store;
  const changeListeners: Record<string, Set<(context: FieldChangeContext) => void>> = {};
  const validationRequests: Record<string, number> = {};

  const subscribeToChange = (name: string, listener: (context: FieldChangeContext) => void) => {
    if (!changeListeners[name]) changeListeners[name] = new Set();
    changeListeners[name].add(listener);
    return () => changeListeners[name].delete(listener);
  };

  const setFieldProps = (name: string, props: Partial<FormField>) => {
    setState((s) => {
      const nextFieldProps = {
        ...s.fieldProps,
        [name]: {
          ...s.fieldProps[name],
          ...props,
        },
      };
      const { nextComputed } = evaluateDynamicProps(s.values, nextFieldProps, s.computedStates);
      return {
        fieldProps: nextFieldProps,
        computedStates: nextComputed,
      };
    });
  };

  const getFieldValidateOn = (field?: FormField): ValidateOn | undefined => field?.validateOn || formValidateOn;

  const shouldValidateOnChange = (field?: FormField, hasExistingError?: boolean) => {
    const validateOn = getFieldValidateOn(field);
    if (validateOn) return validateOn === 'change' || validateOn === 'change-blur';
    return !!field && (['select', 'checkbox', 'radio', 'switch', 'date'].includes(field.type) || !!hasExistingError);
  };

  const shouldValidateOnBlur = (field?: FormField) => {
    const validateOn = getFieldValidateOn(field);
    if (validateOn) return validateOn === 'blur' || validateOn === 'change-blur';
    return true;
  };

  const getEmptyFieldValue = (field: FormField) => field.type === 'checkbox' ? [] : '';

  const deletePathValue = (values: Record<string, unknown>, path: string) => {
    const keys = path.split(/[.[\]]/).filter(Boolean);
    if (keys.length === 0) return values;

    const nextValues = { ...values };
    let current: Record<string, unknown> = nextValues;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (current[key] === null || typeof current[key] !== 'object') return nextValues;
      current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...(current[key] as Record<string, unknown>) };
      current = current[key] as Record<string, unknown>;
    }

    delete current[keys[keys.length - 1]];
    return nextValues;
  };

  const getSubmitValues = (values: Record<string, unknown>) => {
    if (hiddenFieldStrategy === 'keep') return values;

    let submitValues = values;
    const currentFields = getActiveFields(values);
    for (const field of currentFields) {
      const isHidden = typeof field.hidden === 'function' ? field.hidden(values) : field.hidden;
      if (!isHidden) continue;

      submitValues = hiddenFieldStrategy === 'omit'
        ? deletePathValue(submitValues, field.name)
        : setPathValue(submitValues, field.name, getEmptyFieldValue(field));
    }

    return submitValues;
  };

  const validateSingleField = async (name: string, value: unknown, allValues: Record<string, unknown>, shouldTrackValidating: boolean) => {
    const requestId = (validationRequests[name] || 0) + 1;
    validationRequests[name] = requestId;

    if (shouldTrackValidating) {
      setState((s) => ({
        validatingFields: s.validatingFields.includes(name) ? s.validatingFields : [...s.validatingFields, name],
      }));
    }

    try {
      const currentFields = getActiveFields(allValues);
      const error = await validateFieldByName(currentFields, name, value, resolver, allValues, errorMessages);
      if (validationRequests[name] !== requestId) return;
      setState((s) => ({
        errors: { ...s.errors, [name]: error || '' },
        validatingFields: s.validatingFields.filter((f) => f !== name),
      }));
    } catch {
      if (validationRequests[name] !== requestId) return;
      setState((s) => ({
        validatingFields: s.validatingFields.filter((f) => f !== name),
      }));
    }
  };

  const setFieldValue = async (name: string, rawValue: unknown) => {
    const currentFields = getActiveFields(getState().values);
    const field = currentFields.find((f) => f.name === name);
    const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;

    setState((s) => {
      const nextValues = setPathValue(s.values, name, normalizedValue);
      const { nextComputed } = evaluateDynamicProps(nextValues, s.fieldProps, s.computedStates);
      return {
        values: nextValues,
        touched: { ...s.touched, [name]: true },
        computedStates: nextComputed,
      };
    });

    const hasExistingError = !!getState().errors[name];

    if (shouldValidateOnChange(field, hasExistingError)) {
      await validateSingleField(name, normalizedValue, getState().values, true);
    }

    // Trigger side effects
    if (changeListeners[name] && engine) {
      changeListeners[name].forEach((listener) => listener({ value: normalizedValue, engine }));
    }

    // Validate dependent fields automatically
    const nextFields = getActiveFields(getState().values);
    const dependentFields = nextFields.filter((f) => f.dependencies?.includes(name));
    for (const df of dependentFields) {
      const dfValue = get(getState().values, df.name);
      if (getFieldValidateOn(df) !== 'submit') {
        validateSingleField(df.name, dfValue, getState().values, false);
      }
    }
  };

  const setFieldBlur = async (name: string) => {
    setState((s) => ({
      touched: { ...s.touched, [name]: true },
    }));

    const currentValues = getState().values;
    const currentFields = getActiveFields(currentValues);
    const field = currentFields.find((f) => f.name === name);
    if (shouldValidateOnBlur(field)) {
      await validateSingleField(name, get(currentValues, name), currentValues, true);
    }
  };

  const setSubmitting = (isSubmitting: boolean) => setState({ isSubmitting });

  const resetForm = () => {
    const freshValues = getInitialValues();
    const currentFields = getActiveFields(freshValues);
    currentFields.forEach((field) => {
      validationRequests[field.name] = (validationRequests[field.name] || 0) + 1;
    });

    setState((s) => {
      const { nextComputed } = evaluateDynamicProps(freshValues, s.fieldProps, {});
      return {
        values: freshValues,
        errors: {},
        touched: {},
        validatingFields: [],
        isSubmitting: false,
        computedStates: nextComputed,
      };
    });
  };

  const runSubmitValidation = async () => {
    setState({ isSubmitting: true });
    const currentValues = getState().values;
    const submitValues = getSubmitValues(currentValues);
    const currentFields = getActiveFields(submitValues);
    const errors = await validateForm(currentFields, submitValues, resolver, errorMessages);
    const hasError = Object.keys(errors).length > 0;

    const allTouched = currentFields.reduce((acc, field) => {
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
      values: submitValues,
    };
  };

  const appendListItem = (name: string, defaultVal: unknown = {}) => {
    setState((s) => {
      const currentList = (get(s.values, name) as unknown[]) || [];
      const nextList = [...currentList, defaultVal];
      const nextValues = setPathValue(s.values, name, nextList);
      
      const { nextComputed } = evaluateDynamicProps(nextValues, s.fieldProps, s.computedStates);
      return {
        values: nextValues,
        computedStates: nextComputed,
      };
    });
  };

  const removeListItem = (name: string, index: number) => {
    setState((s) => {
      const currentList = (get(s.values, name) as unknown[]) || [];
      const nextList = currentList.filter((_, i) => i !== index);
      const nextValues = setPathValue(s.values, name, nextList);

      const cleanPrefix = `${name}[${index}]`;
      const nextErrors = { ...s.errors };
      const nextTouched = { ...s.touched };
      const nextFieldProps = { ...s.fieldProps };
      const nextComputed = { ...s.computedStates };

      const adjustStateKeys = (record: Record<string, any>, prefix: string) => {
        const nextRecord = { ...record };
        for (const key of Object.keys(nextRecord)) {
          if (key.startsWith(prefix)) {
            const regex = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[(\\d+)\\](.*)`);
            const match = key.match(regex);
            if (match) {
              const itemIndex = parseInt(match[1], 10);
              const suffix = match[2];
              if (itemIndex === index) {
                delete nextRecord[key];
              } else if (itemIndex > index) {
                const newKey = `${name}[${itemIndex - 1}]${suffix}`;
                nextRecord[newKey] = nextRecord[key];
                delete nextRecord[key];
              }
            }
          }
        }
        return nextRecord;
      };

      const finalErrors = adjustStateKeys(nextErrors, `${name}[`);
      const finalTouched = adjustStateKeys(nextTouched, `${name}[`);
      const finalFieldProps = adjustStateKeys(nextFieldProps, `${name}[`);
      const finalComputedStates = adjustStateKeys(nextComputed, `${name}[`);

      const { nextComputed: finalComputed } = evaluateDynamicProps(nextValues, finalFieldProps, finalComputedStates);

      return {
        values: nextValues,
        errors: finalErrors,
        touched: finalTouched,
        fieldProps: finalFieldProps,
        computedStates: finalComputed,
      };
    });
  };

  const engine: FormEngine = {
    store,
    setFieldValue,
    setFieldBlur,
    setSubmitting,
    runSubmitValidation,
    resetForm,
    setFieldProps,
    subscribeToChange,
    appendListItem,
    removeListItem,
  };

  if (schema?.effects) {
    schema.effects(engine);
  }

  return engine;
}
