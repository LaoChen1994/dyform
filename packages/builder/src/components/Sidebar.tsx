import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { FieldType } from 'pdyform-core';

const fieldTemplates: { type: FieldType; label: string }[] = [
  { type: 'text', label: '单行文本' },
  { type: 'number', label: '数字输入' },
  { type: 'select', label: '下拉选择' },
  { type: 'switch', label: '开关控件' },
  { type: 'date', label: '日期选择' },
];

function DraggableField({ field }: { field: typeof fieldTemplates[0] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${field.type}`,
    data: {
      isTemplate: true,
      type: field.type,
      label: field.label,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 mb-2 bg-white border border-slate-200 rounded cursor-grab hover:border-blue-500 hover:shadow-sm flex items-center gap-3 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-sm font-medium">{field.label}</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto">
      <h2 className="font-semibold mb-4 text-slate-800">基础组件</h2>
      {fieldTemplates.map((field) => (
        <DraggableField key={field.type} field={field} />
      ))}
    </div>
  );
}
