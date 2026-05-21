import { create, UseBoundStore, StoreApi } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { FormSchema, FormElement } from 'pdyform-core';

interface BuilderState {
  schema: FormSchema;
  selectedElementId: string | null;
  setSchema: (schema: FormSchema) => void;
  selectElement: (id: string | null) => void;
  addElement: (element: FormElement) => void;
  addChildElement: (parentId: string, element: FormElement) => void;
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
    addChildElement: (parentId, element) =>
      set((state) => {
        const addChildNode = (elements: FormElement[]): boolean => {
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.id === parentId) {
              if (!el.elements) el.elements = [];
              el.elements.push(element);
              return true;
            }
            if (el.nodeType === 'group' || el.nodeType === 'grid' || el.nodeType === 'list') {
              if (el.elements) {
                if (addChildNode(el.elements)) {
                  return true;
                }
              }
            }
          }
          return false;
        };
        if (state.schema.elements) {
          addChildNode(state.schema.elements);
        }
      }),
    updateElement: (id, updates) =>
      set((state) => {
        const updateNode = (elements: FormElement[]) => {
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.id === id) {
              Object.assign(el, updates);
              return true;
            }
            if (el.nodeType === 'group' || el.nodeType === 'grid' || el.nodeType === 'list') {
              if (el.elements) {
                if (updateNode(el.elements)) {
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
            const el = elements[i];
            if (el.id === id) {
              elements.splice(i, 1);
              return true;
            }
            if (el.nodeType === 'group' || el.nodeType === 'grid' || el.nodeType === 'list') {
              if (el.elements) {
                if (removeNode(el.elements)) {
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
