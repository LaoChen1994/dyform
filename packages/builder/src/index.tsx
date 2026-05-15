import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay } from '@dnd-kit/core';
import { useBuilderStore } from './store';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { DynamicForm } from 'pdyform-react';
import type { FieldType, FormElement, FormField } from 'pdyform-core';

type TemplateDragData = {
  isTemplate: true;
  type: FieldType;
  label: string;
};

type ElementDragData = {
  isElement: true;
  element: FormElement;
};

type ActiveDragData = TemplateDragData | ElementDragData;

export function FormBuilder() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const addElement = useBuilderStore((s) => s.addElement);
  const moveElement = useBuilderStore((s) => s.moveElement);
  const selectElement = useBuilderStore((s) => s.selectElement);

  const [activeData, setActiveData] = useState<ActiveDragData | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const current = event.active.data.current;
    if (current?.isTemplate) {
      setActiveData({
        isTemplate: true,
        type: current.type,
        label: current.label,
      });
      return;
    }

    if (current?.isElement) {
      setActiveData({
        isElement: true,
        element: current.element,
      });
      return;
    }

    setActiveData(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveData(null);
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.isTemplate) {
      // Dropping a template onto the canvas
      const newField: FormField = {
        nodeType: 'field',
        id: `field_${Date.now()}`,
        name: `field_${Date.now()}`,
        type: active.data.current.type,
        label: active.data.current.label,
      };
      addElement(newField);
      selectElement(newField.id!);
      return;
    }

    if (active.id !== over.id) {
      // Reordering elements in the canvas
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        moveElement(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full bg-slate-50 text-slate-900 overflow-hidden">
        <Sidebar />
        <Canvas />
        <PropertyPanel />
        
        <DragOverlay>
          {activeData && 'isTemplate' in activeData ? (
            <div className="p-3 bg-white border-2 border-blue-500 rounded shadow-lg flex items-center gap-3 opacity-90 cursor-grabbing">
              <span className="text-sm font-medium">{activeData.label}</span>
            </div>
          ) : null}
          {activeData && 'isElement' in activeData ? (
            <div className="p-4 bg-white border-2 border-blue-500 rounded shadow-lg opacity-90 cursor-grabbing">
              <div className="pointer-events-none">
                <DynamicForm schema={{ elements: [activeData.element] }} onSubmit={() => {}} hideSubmitButton />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
