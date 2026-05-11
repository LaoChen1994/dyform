import React from 'react';
import type { FormField } from 'pdyform-core';
import type { UseFormReturn } from './useForm';
import type { FieldComponentMap } from './components';
export interface FieldItemProps {
    field: FormField;
    form: UseFormReturn;
    componentMap?: FieldComponentMap;
}
export declare const FieldItem: React.FC<FieldItemProps>;
//# sourceMappingURL=FieldItem.d.ts.map