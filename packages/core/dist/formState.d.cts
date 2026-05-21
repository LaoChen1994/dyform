import { FormField, FormSchema, FormResolver, ErrorMessageTemplates } from './types.cjs';

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
    computedStates: Record<string, {
        hidden: boolean;
        disabled: boolean;
    }>;
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
        values: Record<string, unknown>;
    }>;
    resetForm: () => void;
    setFieldProps: (name: string, props: Partial<FormField>) => void;
    subscribeToChange: (name: string, listener: (context: FieldChangeContext) => void) => () => void;
    appendListItem: (name: string, defaultVal?: unknown) => void;
    removeListItem: (name: string, index: number) => void;
}
declare function createFormEngine(schemaOrFields: FormField[] | FormSchema, resolver?: FormResolver, errorMessages?: ErrorMessageTemplates): FormEngine;

export { type FieldChangeContext, type FormEngine, type FormRuntimeState, type StoreListener, type VanillaStore, createFormEngine, createStore };
