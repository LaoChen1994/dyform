import React from 'react';
import type { FormField } from 'pdyform-core';
import type { FieldComponentMap } from './components';
export interface FormFieldRendererProps {
    field: FormField;
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    error?: string;
    /**
     * Custom component map merged with the default map — external entries win.
     *
     * @example
     * ```tsx
     * import { defaultComponentMap } from 'pdyform-react';
     * const myMap = { ...defaultComponentMap, text: MyInput, rating: StarRating };
     * <FormFieldRenderer componentMap={myMap} ... />
     * ```
     */
    componentMap?: FieldComponentMap;
}
export declare const FormFieldRenderer: React.FC<FormFieldRendererProps>;
//# sourceMappingURL=FormFieldRenderer.d.ts.map