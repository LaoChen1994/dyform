import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '../store';
import { DynamicForm } from 'pdyform-react';
import type { FormElement } from 'pdyform-core';

function SortableFieldWrapper({ element }: { element: FormElement }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id! });
  const selectElement = useBuilderStore((s) => s.selectElement);
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedElementId === element.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id!);
      }}
      className={`relative p-4 mb-2 rounded border-2 transition-colors cursor-pointer bg-white ${
        isSelected
          ? 'border-blue-500 bg-blue-50/10'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
      } ${isDragging ? 'opacity-30' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center cursor-grab text-slate-400 hover:text-slate-600 z-10 bg-slate-100 rounded"
      >
        ⋮⋮
      </div>
      <div className="pointer-events-none">
        <DynamicForm schema={{ elements: [element] }} onSubmit={() => {}} hideSubmitButton />
      </div>
    </div>
  );
}

export function Canvas() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const selectElement = useBuilderStore((s) => s.selectElement);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  return (
    <div
      className="flex-1 p-8 overflow-auto bg-slate-100"
      onClick={() => selectElement(null)}
    >
      <div
        ref={setNodeRef}
        className={`max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm min-h-[600px] transition-colors ${
          isOver ? 'ring-2 ring-blue-400 bg-blue-50/10' : ''
        }`}
      >
        <h1 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-100">
          {schema.title || '未命名表单'}
        </h1>
        
        {elements.length === 0 && (
          <div className="h-40 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 pointer-events-none">
            请将左侧组件拖拽至此处
          </div>
        )}

        <SortableContext
          items={elements.map((e) => e.id!)}
          strategy={verticalListSortingStrategy}
        >
          {elements.map((element) => (
            <SortableFieldWrapper key={element.id} element={element} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
