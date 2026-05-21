import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface TemplateItem {
  type: string;
  label: string;
  isLayout?: boolean;
}

const layoutTemplates: TemplateItem[] = [
  { type: 'list', label: '动态列表容器 (FormList)', isLayout: true },
  { type: 'group', label: '分组面板容器 (Group)', isLayout: true },
  { type: 'grid', label: '两列网格布局 (Grid)', isLayout: true },
];

const fieldTemplates: TemplateItem[] = [
  { type: 'text', label: '单行文本输入 (Input)' },
  { type: 'number', label: '数字数值输入 (Number)' },
  { type: 'select', label: '下拉单选菜单 (Select)' },
  { type: 'switch', label: '开关选择控制 (Switch)' },
  { type: 'date', label: '日期时间选择 (Date)' },
];

function DraggableField({ field }: { field: TemplateItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${field.type}`,
    data: {
      isTemplate: true,
      type: field.type,
      label: field.label,
      isLayout: field.isLayout,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 mb-2 bg-white border border-slate-200 rounded cursor-grab hover:border-blue-500 hover:shadow-md flex items-center justify-between transition-all ${
        isDragging ? 'opacity-50 border-dashed border-blue-400' : ''
      } ${field.isLayout ? 'border-indigo-100 bg-indigo-50/10' : ''}`}
    >
      <span className="text-sm font-medium text-slate-700">{field.label}</span>
      {field.isLayout && (
        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-1.5 py-0.5 rounded-sm">
          容器
        </span>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">布局容器</h3>
        {layoutTemplates.map((field) => (
          <DraggableField key={field.type} field={field} />
        ))}
      </div>
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">表单字段</h3>
        {fieldTemplates.map((field) => (
          <DraggableField key={field.type} field={field} />
        ))}
      </div>
    </div>
  );
}
