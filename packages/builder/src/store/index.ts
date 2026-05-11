import { create, UseBoundStore, StoreApi } from 'zustand';
import { immer } from 'zustand/middleware/immer';
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

export const useBuilderStore: UseBoundStore<StoreApi<BuilderState>> = create<BuilderState>()(
  immer((set) => ({
    schema: {
      title: 'New Form',
      elements: [],
    },
    selectedElementId: null,
    setSchema: (schema) =>
      set((state) => {
        state.schema = schema;
      }),
    selectElement: (id) =>
      set((state) => {
        state.selectedElementId = id;
      }),
    addElement: (element) =>
      set((state) => {
        if (!state.schema.elements) {
          state.schema.elements = [];
        }
        state.schema.elements.push(element);
      }),
    updateElement: (id, updates) =>
      set((state) => {
        const updateNode = (elements: FormElement[]) => {
          for (let i = 0; i < elements.length; i++) {
            if (elements[i].id === id) {
              Object.assign(elements[i], updates);
              return true;
            }
            if (elements[i].nodeType === 'group' || elements[i].nodeType === 'grid') {
              if (elements[i].elements) {
                if (updateNode(elements[i].elements!)) {
                  return true;
                }
              }
            }
          }
          return false;
        };
        if (state.schema.elements) {
          updateNode(state.schema.elements);
        }
      }),
    removeElement: (id) =>
      set((state) => {
        const removeNode = (elements: FormElement[]) => {
          for (let i = 0; i < elements.length; i++) {
            if (elements[i].id === id) {
              elements.splice(i, 1);
              return true;
            }
            if (elements[i].nodeType === 'group' || elements[i].nodeType === 'grid') {
              if (elements[i].elements) {
                if (removeNode(elements[i].elements!)) {
                  return true;
                }
              }
            }
          }
          return false;
        };
        if (state.schema.elements) {
          removeNode(state.schema.elements);
        }
        if (state.selectedElementId === id) {
          state.selectedElementId = null;
        }
      }),
    moveElement: (fromIndex, toIndex) =>
      set((state) => {
        if (!state.schema.elements) return;
        const [moved] = state.schema.elements.splice(fromIndex, 1);
        state.schema.elements.splice(toIndex, 0, moved);
      }),
  }))
);
