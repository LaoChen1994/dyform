import React, { useMemo, useEffect } from 'react';
import { useBuilderStore } from '../store';
import { DynamicForm, useForm } from 'pdyform-react';
import type { FormSchema, FormField, FormElement } from 'pdyform-core';

// Recursive helper to find any element in the nested layout tree
const findElementById = (elements: FormElement[], id: string | null): FormElement | undefined => {
  if (!id) return undefined;
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.nodeType === 'group' || el.nodeType === 'grid' || el.nodeType === 'list') {
      const found = findElementById(el.elements || [], id);
      if (found) return found;
    }
  }
  return undefined;
};

export function PropertyPanel() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const selectElement = useBuilderStore((s) => s.selectElement);
  const updateElement = useBuilderStore((s) => s.updateElement);
  const removeElement = useBuilderStore((s) => s.removeElement);
  const addChildElement = useBuilderStore((s) => s.addChildElement);

  const selectedElement = useMemo(() => {
    return findElementById(elements, selectedElementId);
  }, [elements, selectedElementId]);

  const propertySchema = useMemo<FormSchema>(() => {
    if (!selectedElement) return { elements: [] };

    const commonFields: FormElement[] = [
      {
        id: 'id',
        name: 'id',
        label: '组件内部ID (只读)',
        type: 'text',
        defaultValue: selectedElement.id,
        disabled: true,
      }
    ];

    if (selectedElement.nodeType === 'group') {
      return {
        elements: [
          ...commonFields,
          {
            id: 'title',
            name: 'title',
            label: '分组标题',
            type: 'text',
            defaultValue: selectedElement.title || '',
          },
          {
            id: 'description',
            name: 'description',
            label: '分组描述',
            type: 'text',
            defaultValue: selectedElement.description || '',
          },
        ],
      };
    }

    if (selectedElement.nodeType === 'grid') {
      return {
        elements: [
          ...commonFields,
          {
            id: 'columns',
            name: 'columns',
            label: '网格列数 (1-4)',
            type: 'number',
            defaultValue: selectedElement.columns || 2,
            validations: [
              { type: 'min', value: 1, message: '列数不能小于1' },
              { type: 'max', value: 4, message: '列数不能大于4' }
            ],
          },
        ],
      };
    }

    if (selectedElement.nodeType === 'list') {
      return {
        elements: [
          ...commonFields,
          {
            id: 'title',
            name: 'title',
            label: '列表容器名称',
            type: 'text',
            defaultValue: selectedElement.title || '',
            validations: [{ type: 'required' }],
          },
          {
            id: 'name',
            name: 'name',
            label: '数据绑定标识 (Name)',
            type: 'text',
            defaultValue: selectedElement.name || '',
            validations: [{ type: 'required' }],
          },
          {
            id: 'description',
            name: 'description',
            label: '列表辅助描述',
            type: 'text',
            defaultValue: selectedElement.description || '',
          },
        ],
      };
    }

    // Default: FormField
    const field = selectedElement as FormField;
    return {
      elements: [
        ...commonFields,
        {
          id: 'label',
          name: 'label',
          label: '字段显示名称',
          type: 'text',
          defaultValue: field.label || '',
          validations: [{ type: 'required' }],
        },
        {
          id: 'name',
          name: 'name',
          label: '字段标识 (Name)',
          type: 'text',
          defaultValue: field.name || '',
          validations: [{ type: 'required' }],
        },
        {
          id: 'placeholder',
          name: 'placeholder',
          label: '输入框占位符',
          type: 'text',
          defaultValue: field.placeholder || '',
        },
        {
          id: 'required',
          name: 'required',
          label: '是否为必填项',
          type: 'switch',
          defaultValue: !!field.validations?.find((validation) => validation.type === 'required'),
        },
        {
          id: 'hidden',
          name: 'hidden',
          label: '动态隐藏条件 (表达式)',
          type: 'text',
          placeholder: '如: $values.age > 18',
          defaultValue: typeof field.hidden === 'string' ? field.hidden : '',
        },
        {
          id: 'disabled',
          name: 'disabled',
          label: '动态禁用条件 (表达式)',
          type: 'text',
          placeholder: '如: $values.gender === "female"',
          defaultValue: typeof field.disabled === 'string' ? field.disabled : '',
        },
      ],
    };
  }, [selectedElement?.id, selectedElement?.nodeType]);

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
          const updates: Record<string, any> = {};

          if (selectedElement.nodeType === 'group') {
            updates.title = currentVals.title;
            updates.description = currentVals.description;
          } else if (selectedElement.nodeType === 'grid') {
            updates.columns = Number(currentVals.columns) || 2;
          } else if (selectedElement.nodeType === 'list') {
            updates.title = currentVals.title;
            updates.name = currentVals.name;
            updates.description = currentVals.description;
          } else {
            // FormField
            updates.label = currentVals.label;
            updates.name = currentVals.name;
            updates.placeholder = currentVals.placeholder;

            if (currentVals.required) {
              updates.validations = [{ type: 'required' }];
            } else {
              updates.validations = [];
            }

            if (currentVals.hidden) {
              updates.hidden = currentVals.hidden;
            } else {
              updates.hidden = false;
            }

            if (currentVals.disabled) {
              updates.disabled = currentVals.disabled;
            } else {
              updates.disabled = false;
            }
          }

          updateElement(selectedElement.id!, updates);
        }
      }, 300);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [form.engine.store, selectedElement?.id, selectedElement?.nodeType, updateElement]);

  const handleAddChildField = (type: string) => {
    if (!selectedElement) return;
    const childId = `field_${Date.now()}`;
    const newChild = {
      nodeType: 'field' as const,
      id: childId,
      name: `subfield_${Date.now()}`,
      label: type === 'text' ? '子文本字段' : '子数字字段',
      type,
    };
    addChildElement(selectedElement.id!, newChild);
  };

  if (!selectedElement) {
    return (
      <div className="w-80 border-l border-slate-200 bg-slate-50 p-4 text-slate-400 text-sm text-center pt-20 flex-shrink-0">
        请先在画布中选中一个组件配置属性
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800">属性配置</h2>
          <span className="text-[10px] text-slate-400 font-mono">类型: {selectedElement.nodeType || 'field'}</span>
        </div>
        <button
          onClick={() => removeElement(selectedElement.id!)}
          className="text-red-500 hover:text-red-600 text-sm font-medium"
        >
          删除组件
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col justify-between">
        <div className="p-4">
          <DynamicForm
            form={form}
            schema={propertySchema}
            onSubmit={() => {}}
            hideSubmitButton
          />
        </div>

        {/* Sub Elements Manager for nested Layout Containers (Group, Grid, List) */}
        {(selectedElement.nodeType === 'group' || selectedElement.nodeType === 'grid' || selectedElement.nodeType === 'list') && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-xs text-slate-800 tracking-wide uppercase">子字段管理 ({selectedElement.elements?.length || 0})</h3>
            </div>
            
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
              {(selectedElement.elements || []).map((child: any, idx: number) => (
                <div
                  key={child.id || idx}
                  onClick={() => selectElement(child.id)}
                  className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded text-xs hover:border-blue-400 cursor-pointer shadow-sm transition-all"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{child.label || child.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{child.type} | {child.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(child.id);
                    }}
                    className="text-red-500 hover:text-red-600 font-medium text-[10px]"
                  >
                    删除
                  </button>
                </div>
              ))}
              {(selectedElement.elements || []).length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-4 bg-white border border-dashed border-slate-200 rounded">
                  当前容器暂无子字段，请点击下方按钮添加
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAddChildField('text')}
                className="flex-1 py-1.5 border border-dashed border-slate-200 hover:border-slate-300 rounded text-xs font-semibold text-slate-600 hover:text-slate-700 bg-white transition-all shadow-sm flex items-center justify-center"
              >
                + 文本字段
              </button>
              <button
                type="button"
                onClick={() => handleAddChildField('number')}
                className="flex-1 py-1.5 border border-dashed border-slate-200 hover:border-slate-300 rounded text-xs font-semibold text-slate-600 hover:text-slate-700 bg-white transition-all shadow-sm flex items-center justify-center"
              >
                + 数字字段
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
