import { FormField, FormSchema, FormResolver, ErrorMessageTemplates } from './types.js';

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
    touched: Record<string, boolean>;
    validatingFields: string[];
    isSubmitting: boolean;
    fieldProps: Record<string, Partial<FormField>>;
}
type FieldChangeContext = {
    value: unknown;
    engine: FormEngine;
};
interface FormEngine {
    store: VanillaStore<FormRuntimeState>;
    setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
    setFieldBlur: (name: string) => Promise<void>;
    setSubmitting: (isSubmitting: boolean) => void;
    runSubmitValidation: () => Promise<{
        state: FormRuntimeState;
        hasError: boolean;
    }>;
    setFieldProps: (name: string, props: Partial<FormField>) => void;
    subscribeToChange: (name: string, listener: (context: FieldChangeContext) => void) => () => void;
}
declare function createFormEngine(schemaOrFields: FormField[] | FormSchema, resolver?: FormResolver, errorMessages?: ErrorMessageTemplates): FormEngine;

export { type FieldChangeContext, type FormEngine, type FormRuntimeState, type StoreListener, type VanillaStore, createFormEngine, createStore };
