import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { useBuilderStore } from './store';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import type { FormField } from 'pdyform-core';

export function FormBuilder() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const addElement = useBuilderStore((s) => s.addElement);
  const moveElement = useBuilderStore((s) => s.moveElement);
  const selectElement = useBuilderStore((s) => s.selectElement);

  const handleDragEnd = (event: DragEndEvent) => {
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
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full bg-slate-50 text-slate-900 overflow-hidden">
        <Sidebar />
        <Canvas />
        <PropertyPanel />
      </div>
    </DndContext>
  );
}
