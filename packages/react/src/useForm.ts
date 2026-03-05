import { useMemo, useCallback } from 'react';
import { useStore } from 'zustand';
import { createFormStore, FormSchema, FormStore, get, FormRuntimeState } from 'pdyform-core';

export interface UseFormOptions {
  schema: FormSchema;
}

export interface UseFormReturn {
  store: ReturnType<typeof createFormStore>;
  state: FormStore;
  setValue: (name: string, value: any) => Promise<void>;
  getValue: (name: string) => any;
  setError: (name: string, error: string) => void;
  validate: () => Promise<{ hasError: boolean; values: any; state: FormRuntimeState }>;
  reset: () => void;
}

export function useForm({ schema }: UseFormOptions): UseFormReturn {
  const store = useMemo(() => createFormStore(schema.fields, schema.resolver, schema.errorMessages), [schema]);
  const state = useStore(store);

  const setValue = useCallback(async (name: string, value: any) => {
    await store.getState().setFieldValue(name, value);
  }, [store]);

  const getValue = useCallback((name: string) => {
    return get(store.getState().values, name);
  }, [store]);

  const setError = useCallback((name: string, error: string) => {
    store.setState((prev) => ({
      errors: { ...prev.errors, [name]: error },
    }));
  }, [store]);

  const validate = useCallback(async () => {
    const { hasError, state: validatedState } = await store.getState().runSubmitValidation();
    return { hasError, values: validatedState.values, state: validatedState };
  }, [store]);

  const reset = useCallback(() => {
    store.setState({
      values: {}, // Need a proper reset in core, but let's do simple reset here first
      errors: {},
      isSubmitting: false,
    });
  }, [store]);

  return {
    store,
    state,
    setValue,
    getValue,
    setError,
    validate,
    reset,
  };
}
