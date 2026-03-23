import { FormField, FormResolver, ErrorMessageTemplates } from './types.cjs';

type StoreListener<T> = (state: T, prevState: T) => void;
interface VanillaStore<T> {
    getState: () => T;
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
    subscribe: (listener: StoreListener<T>) => () => void;
}
declare function createStore<T>(initialState: T): VanillaStore<T>;
interface FormRuntimeState {
    values: Record<string, unknown>;
    errors: Record<string, string>;
    validatingFields: string[];
    isSubmitting: boolean;
}
interface FormEngine {
    store: VanillaStore<FormRuntimeState>;
    setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
    setFieldBlur: (name: string) => Promise<void>;
    setSubmitting: (isSubmitting: boolean) => void;
    runSubmitValidation: () => Promise<{
        state: FormRuntimeState;
        hasError: boolean;
    }>;
}
declare function createFormEngine(fields: FormField[], resolver?: FormResolver, errorMessages?: ErrorMessageTemplates): FormEngine;

export { type FormEngine, type FormRuntimeState, type StoreListener, type VanillaStore, createFormEngine, createStore };
