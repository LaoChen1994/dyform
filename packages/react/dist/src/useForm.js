import { useMemo, useCallback, useSyncExternalStore } from 'react';
import { createFormEngine, get } from 'pdyform-core';
export function useForm({ schema }) {
    const engine = useMemo(() => createFormEngine(schema, schema.resolver, schema.errorMessages), [schema]);
    const state = useSyncExternalStore((listener) => engine.store.subscribe(listener), engine.store.getState);
    // Still provided for backward compatibility / simple primitive watching
    const useWatch = useCallback((name) => {
        return useSyncExternalStore((listener) => engine.store.subscribe(listener), () => get(engine.store.getState().values, name));
    }, [engine]);
    // To avoid useSyncExternalStore recreating object refs and causing re-renders, 
    // we do granular subscriptions for the field item.
    const useFieldState = useCallback((name) => {
        const value = useSyncExternalStore((listener) => engine.store.subscribe(listener), () => get(engine.store.getState().values, name));
        const error = useSyncExternalStore((listener) => engine.store.subscribe(listener), () => engine.store.getState().errors[name]);
        const touched = useSyncExternalStore((listener) => engine.store.subscribe(listener), () => engine.store.getState().touched[name]);
        const isValidating = useSyncExternalStore((listener) => engine.store.subscribe(listener), () => engine.store.getState().validatingFields.includes(name));
        // values is needed for disabled/hidden calculations
        const values = useSyncExternalStore((listener) => engine.store.subscribe(listener), () => engine.store.getState().values);
        return { value, error, touched, isValidating, values };
    }, [engine]);
    const setValue = useCallback(async (name, value) => {
        await engine.setFieldValue(name, value);
    }, [engine]);
    const getValue = useCallback((name) => {
        return get(engine.store.getState().values, name);
    }, [engine]);
    const setError = useCallback((name, error) => {
        engine.store.setState((prev) => ({
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
            touched: {},
            validatingFields: [],
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
        useFieldState,
    };
}
