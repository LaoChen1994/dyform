import React, { useMemo, useEffect } from 'react';
import { useBuilderStore } from '../store';
import { DynamicForm, useForm } from 'pdyform-react';
import type { FormSchema, FormField } from 'pdyform-core';

export function PropertyPanel() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const updateElement = useBuilderStore((s) => s.updateElement);
  const removeElement = useBuilderStore((s) => s.removeElement);

  const selectedElement = elements.find((e) => e.id === selectedElementId) as FormField | undefined;

  const propertySchema = useMemo<FormSchema>(() => {
    if (!selectedElement) return { elements: [] };
    return {
      elements: [
        {
          id: 'label',
          name: 'label',
          label: '标题',
          type: 'text',
          defaultValue: selectedElement.label,
          validations: [{ type: 'required' }],
        },
        {
          id: 'name',
          name: 'name',
          label: '字段标识 (Name)',
          type: 'text',
          defaultValue: selectedElement.name,
          validations: [{ type: 'required' }],
        },
        {
          id: 'placeholder',
          name: 'placeholder',
          label: '占位提示',
          type: 'text',
          defaultValue: (selectedElement as any).placeholder,
        },
        {
          id: 'required',
          name: 'required',
          label: '是否必填',
          type: 'switch',
          defaultValue: !!(selectedElement as any).validations?.find((v: any) => v.type === 'required'),
        }
      ],
    };
  }, [selectedElement?.id]);

  const form = useForm({ schema: propertySchema });

  useEffect(() => {
    if (!selectedElement) return;
    
    let timer: ReturnType<typeof setTimeout>;
    
    const unsubscribe = form.engine.store.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const state = form.engine.store.getState();
        const currentVals = state.values;
        if (currentVals && Object.keys(currentVals).length > 0) {
          const updates: any = {
            label: currentVals.label,
            name: currentVals.name,
            placeholder: currentVals.placeholder,
          };
          
          if (currentVals.required) {
             updates.validations = [{ type: 'required' }];
          } else {
             updates.validations = [];
          }
          
          updateElement(selectedElement.id!, updates);
        }
      }, 300);
    });
    
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [form.engine.store, selectedElement?.id, updateElement]);

  if (!selectedElement) {
    return (
      <div className="w-80 border-l border-slate-200 bg-slate-50 p-4 text-slate-400 text-sm text-center pt-20">
        请先在画布中选中一个组件
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">属性配置</h2>
        <button
          onClick={() => removeElement(selectedElement.id!)}
          className="text-red-500 hover:text-red-600 text-sm font-medium"
        >
          删除
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <DynamicForm
          form={form}
          schema={propertySchema}
          onSubmit={() => {}}
          hideSubmitButton
        />
      </div>
    </div>
  );
}
