import * as zustand_vanilla from 'zustand/vanilla';
import { FormField, FormResolver, ErrorMessageTemplates } from './types.js';

interface FormRuntimeState {
    values: Record<string, any>;
    errors: Record<string, string>;
    validatingFields: string[];
    isSubmitting: boolean;
}
interface FormStore extends FormRuntimeState {
    setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
    setFieldBlur: (name: string) => Promise<void>;
    setSubmitting: (isSubmitting: boolean) => void;
    runSubmitValidation: () => Promise<{
        state: FormRuntimeState;
        hasError: boolean;
    }>;
}
declare function createFormStore(fields: FormField[], resolver?: FormResolver, errorMessages?: ErrorMessageTemplates): zustand_vanilla.StoreApi<FormStore>;

export { type FormRuntimeState, type FormStore, createFormStore };
