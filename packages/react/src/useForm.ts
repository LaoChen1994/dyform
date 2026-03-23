import { useMemo, useCallback, useSyncExternalStore } from 'react';
import { createFormEngine, FormSchema, FormEngine, get, FormRuntimeState } from 'pdyform-core';

export interface UseFormOptions {
  schema: FormSchema;
}

export interface UseFormReturn {
  engine: FormEngine;
  state: FormRuntimeState;
  setValue: (name: string, value: any) => Promise<void>;
  getValue: (name: string) => any;
  setError: (name: string, error: string) => void;
  validate: () => Promise<{ hasError: boolean; values: any; state: FormRuntimeState }>;
  reset: () => void;
  useWatch: (name: string) => any;
}

export function useForm({ schema }: UseFormOptions): UseFormReturn {
  const engine = useMemo(() => createFormEngine(schema.fields, schema.resolver, schema.errorMessages), [schema]);
  const state = useSyncExternalStore(
    (listener) => engine.store.subscribe(listener),
    engine.store.getState
  );

  // 细粒度订阅 Hook：仅当特定 name 的字段值变化时，所在的子组件才会重渲染
  const useWatch = useCallback((name: string) => {
    return useSyncExternalStore(
      (listener) => engine.store.subscribe(listener),
      () => get(engine.store.getState().values, name)
    );
  }, [engine]);

  const setValue = useCallback(async (name: string, value: any) => {
    await engine.setFieldValue(name, value);
  }, [engine]);

  const getValue = useCallback((name: string) => {
    return get(engine.store.getState().values, name);
  }, [engine]);

  const setError = useCallback((name: string, error: string) => {
    engine.store.setState((prev: FormRuntimeState) => ({
      errors: { ...prev.errors, [name]: error },
    }));
  }, [engine]);

  const validate = useCallback(async () => {
    const { hasError, state: validatedState } = await engine.runSubmitValidation();
    return { hasError, values: validatedState.values, state: validatedState };
  }, [engine]);

  const reset = useCallback(() => {
    engine.store.setState({
      values: {}, 
      errors: {},
      isSubmitting: false,
    });
  }, [engine]);

  return {
    engine,
    state,
    setValue,
    getValue,
    setError,
    validate,
    reset,
    useWatch,
  };
}
