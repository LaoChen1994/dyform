import { FormSchema, FormEngine, FormRuntimeState } from 'pdyform-core';
export interface UseFormOptions {
    schema: FormSchema;
}
export interface UseFormReturn {
    engine: FormEngine;
    state: FormRuntimeState;
    setValue: (name: string, value: any) => Promise<void>;
    getValue: (name: string) => any;
    setError: (name: string, error: string) => void;
    validate: () => Promise<{
        hasError: boolean;
        values: any;
        state: FormRuntimeState;
    }>;
    reset: () => void;
    useWatch: (name: string) => any;
    useFieldState: (name: string) => {
        value: any;
        error?: string;
        touched?: boolean;
        isValidating: boolean;
        values: any;
        fieldProps?: Partial<import('pdyform-core').FormField>;
    };
}
export declare function useForm({ schema }: UseFormOptions): UseFormReturn;
//# sourceMappingURL=useForm.d.ts.map