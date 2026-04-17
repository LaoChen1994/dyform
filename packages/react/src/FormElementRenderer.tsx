import React from 'react';
import type { FormElement, FormField, FormGroup, FormGrid } from 'pdyform-core';
import { FieldItem } from './FieldItem';
import type { UseFormReturn } from './useForm';
import type { FieldComponentMap } from './components';

export interface FormElementRendererProps {
  elements: FormElement[];
  form: UseFormReturn;
  componentMap?: FieldComponentMap;
}

export const FormElementRenderer: React.FC<FormElementRendererProps> = ({ elements, form, componentMap }) => {
  return (
    <>
      {elements.map((el, index) => {
        const key = el.id || ('name' in el ? el.name : `el-${index}`);

        if (el.nodeType === 'group') {
          const group = el as FormGroup;
          return (
            <div key={key} className={`space-y-4 p-4 border rounded-md ${group.className || ''}`}>
              {(group.title || group.description) && (
                <div className="space-y-1">
                  {group.title && <h3 className="font-semibold text-lg tracking-tight">{group.title}</h3>}
                  {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
                </div>
              )}
              <div className="space-y-4">
                <FormElementRenderer elements={group.elements} form={form} componentMap={componentMap} />
              </div>
            </div>
          );
        }

        if (el.nodeType === 'grid') {
          const grid = el as FormGrid;
          const cols = grid.columns || 2;
          return (
            <div 
              key={key} 
              className={`grid gap-4 ${grid.className || ''}`} 
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              <FormElementRenderer elements={grid.elements} form={form} componentMap={componentMap} />
            </div>
          );
        }

        // By default, treat as FormField
        return (
          <FieldItem 
            key={key} 
            field={el as FormField} 
            form={form} 
            componentMap={componentMap} 
          />
        );
      })}
    </>
  );
};
