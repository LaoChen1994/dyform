import { create } from 'zustand';
import type { FormSchema, FormElement } from 'pdyform-core';

interface BuilderState {
  schema: FormSchema;
  selectedElementId: string | null;
  setSchema: (schema: FormSchema) => void;
  selectElement: (id: string | null) => void;
  addElement: (element: FormElement) => void;
  updateElement: (id: string, updates: Partial<FormElement>) => void;
  removeElement: (id: string) => void;
  moveElement: (fromIndex: number, toIndex: number) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  schema: {
    title: 'New Form',
    elements: [],
  },
  selectedElementId: null,
  setSchema: (schema) => set({ schema }),
  selectElement: (id) => set({ selectedElementId: id }),
  addElement: (element) =>
    set((state) => ({
      schema: {
        ...state.schema,
        elements: [...(state.schema.elements || []), element],
      },
    })),
  updateElement: (id, updates) =>
    set((state) => {
      const updateNode = (elements: FormElement[]): FormElement[] => {
        return elements.map((el) => {
          if (el.id === id) {
            return { ...el, ...updates } as FormElement;
          }
          if (el.nodeType === 'group' || el.nodeType === 'grid') {
            return { ...el, elements: updateNode(el.elements) } as FormElement;
          }
          return el;
        });
      };
      return {
        schema: {
          ...state.schema,
          elements: updateNode(state.schema.elements || []),
        },
      };
    }),
  removeElement: (id) =>
    set((state) => {
      const removeNode = (elements: FormElement[]): FormElement[] => {
        return elements.filter((el) => el.id !== id).map((el) => {
          if (el.nodeType === 'group' || el.nodeType === 'grid') {
            return { ...el, elements: removeNode(el.elements) } as FormElement;
          }
          return el;
        });
      };
      return {
        schema: {
          ...state.schema,
          elements: removeNode(state.schema.elements || []),
        },
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
      };
    }),
  moveElement: (fromIndex, toIndex) =>
    set((state) => {
      const elements = [...(state.schema.elements || [])];
      const [moved] = elements.splice(fromIndex, 1);
      elements.splice(toIndex, 0, moved);
      return {
        schema: {
          ...state.schema,
          elements,
        },
      };
    }),
}));
