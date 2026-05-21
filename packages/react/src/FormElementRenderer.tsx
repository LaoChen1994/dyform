import React from 'react';
import type { FormElement, FormField, FormGroup, FormGrid, FormList } from 'pdyform-core';
import { FieldItem } from './FieldItem';
import type { UseFormReturn } from './useForm';
import type { FieldComponentMap } from './components';

export interface FormElementRendererProps {
  elements: FormElement[];
  form: UseFormReturn;
  componentMap?: FieldComponentMap;
  parentPath?: string;
}

export const FormElementRenderer: React.FC<FormElementRendererProps> = ({
  elements,
  form,
  componentMap,
  parentPath,
}) => {
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
                <FormElementRenderer
                  elements={group.elements}
                  form={form}
                  componentMap={componentMap}
                  parentPath={parentPath}
                />
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
              <FormElementRenderer
                elements={grid.elements}
                form={form}
                componentMap={componentMap}
                parentPath={parentPath}
              />
            </div>
          );
        }

        if (el.nodeType === 'list') {
          const list = el as FormList;
          const listPath = parentPath ? `${parentPath}.${list.name}` : list.name;
          const listValue = (form.getValue(listPath) as unknown[]) || [];

          return (
            <div key={key} className={`space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50/50 ${list.className || ''}`}>
              {(list.title || list.description) && (
                <div className="space-y-1 border-b border-slate-100 pb-2 flex justify-between items-center">
                  <div>
                    {list.title && <h3 className="font-semibold text-base tracking-tight text-slate-800">{list.title}</h3>}
                    {list.description && <p className="text-xs text-muted-foreground">{list.description}</p>}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {listValue.map((_, rowIndex) => {
                  const rowPath = `${listPath}[${rowIndex}]`;
                  return (
                    <div key={`${key}-${rowIndex}`} className="p-4 border border-slate-100 bg-white rounded-md relative shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-xs font-semibold text-slate-500">第 {rowIndex + 1} 项</span>
                        <button
                          type="button"
                          onClick={() => form.removeListItem(list.name, rowIndex)}
                          className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                      <div className="space-y-4">
                        <FormElementRenderer
                          elements={list.elements}
                          form={form}
                          componentMap={componentMap}
                          parentPath={rowPath}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => form.appendListItem(list.name, {})}
                className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 bg-white transition-all flex justify-center items-center gap-1 shadow-sm"
              >
                + 添加项
              </button>
            </div>
          );
        }

        // By default, treat as FormField
        const field = el as FormField;
        const fullFieldName = parentPath ? `${parentPath}.${field.name}` : field.name;

        return (
          <FieldItem 
            key={key} 
            field={{ ...field, name: fullFieldName }} 
            form={form} 
            componentMap={componentMap} 
          />
        );
      })}
    </>
  );
};
