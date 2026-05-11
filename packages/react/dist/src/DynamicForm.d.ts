import React from 'react';
import { FormSchema } from 'pdyform-core';
import { UseFormReturn } from './useForm';
import type { FieldComponentMap } from './components';
interface DynamicFormProps {
    schema: FormSchema;
    onSubmit: (values: Record<string, any>) => void;
    className?: string;
    form?: UseFormReturn;
    componentMap?: FieldComponentMap;
    hideSubmitButton?: boolean;
}
export declare const DynamicForm: React.FC<DynamicFormProps>;
export {};
//# sourceMappingURL=DynamicForm.d.ts.map