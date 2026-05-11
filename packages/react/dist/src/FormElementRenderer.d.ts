import React from 'react';
import type { FormElement } from 'pdyform-core';
import type { UseFormReturn } from './useForm';
import type { FieldComponentMap } from './components';
export interface FormElementRendererProps {
    elements: FormElement[];
    form: UseFormReturn;
    componentMap?: FieldComponentMap;
}
export declare const FormElementRenderer: React.FC<FormElementRendererProps>;
//# sourceMappingURL=FormElementRenderer.d.ts.map