import { Component } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { FormField } from 'pdyform-core';
import { FormRuntimeState } from 'pdyform-core';
import { FormSchema } from 'pdyform-core';
import { FormStore } from 'pdyform-core';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { StoreApi } from 'zustand/vanilla';

declare type __VLS_Props = {
    schema: FormSchema;
    className?: string;
    form?: UseFormReturn;
};

declare type __VLS_Props_2 = {
    field: FormField;
    modelValue: any;
    error?: string;
    /**
     * Custom component map.
     * Entries here are merged with the default map, so you can override
     * specific types or add entirely new ones.
     *
     * @example
     * ```ts
     * import { defaultComponentMap } from 'pdyform-vue';
     * const myMap = {
     *   ...defaultComponentMap,
     *   text: MyCustomInput,       // overrides built-in text input
     *   rating: StarRatingField,   // adds a new field type
     * };
     * ```
     */
    componentMap?: FieldComponentMap;
};

export declare const defaultComponentMap: FieldComponentMap;

export declare const DynamicForm: DefineComponent<__VLS_Props, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
submit: (...args: any[]) => void;
}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{
onSubmit?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLFormElement>;

export declare type FieldComponentMap = Record<string, Component>;

export declare interface FieldRendererProps {
    field: FormField;
    fieldId: string;
    modelValue: any;
    ariaInvalid?: boolean;
    ariaRequired?: boolean;
    ariaDescribedby?: string;
}

export declare const FormFieldRenderer: DefineComponent<__VLS_Props_2, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
"update:modelValue": (...args: any[]) => void;
blur: (...args: any[]) => void;
}, string, PublicProps, Readonly<__VLS_Props_2> & Readonly<{
"onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
onBlur?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare function useForm({ schema }: UseFormOptions): {
    store: StoreApi<FormStore>;
    state: Ref<    {
    setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
    setFieldBlur: (name: string) => Promise<void>;
    setSubmitting: (isSubmitting: boolean) => void;
    runSubmitValidation: () => Promise<{
    state: FormRuntimeState;
    hasError: boolean;
    }>;
    values: Record<string, any>;
    errors: Record<string, string>;
    validatingFields: string[];
    isSubmitting: boolean;
    }, FormStore | {
    setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
    setFieldBlur: (name: string) => Promise<void>;
    setSubmitting: (isSubmitting: boolean) => void;
    runSubmitValidation: () => Promise<{
    state: FormRuntimeState;
    hasError: boolean;
    }>;
    values: Record<string, any>;
    errors: Record<string, string>;
    validatingFields: string[];
    isSubmitting: boolean;
    }>;
    setValue: (name: string, value: any) => Promise<void>;
    getValue: (name: string) => any;
    validate: () => Promise<{
        hasError: boolean;
        values: Record<string, any>;
    }>;
    reset: () => void;
};

export declare interface UseFormOptions {
    schema: FormSchema;
}

export declare type UseFormReturn = ReturnType<typeof useForm>;

export { }
