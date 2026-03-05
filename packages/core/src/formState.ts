import { createStore } from 'zustand/vanilla';
import type { FormField, FormResolver, ErrorMessageTemplates } from './types';
import { getDefaultValues, normalizeFieldValue, validateFieldByName, validateForm, get, set as setPathValue } from './utils';

export interface FormRuntimeState {
  values: Record<string, any>;
  errors: Record<string, string>;
  validatingFields: string[];
  isSubmitting: boolean;
}

export interface FormStore extends FormRuntimeState {
  setFieldValue: (name: string, rawValue: unknown) => Promise<void>;
  setFieldBlur: (name: string) => Promise<void>;
  setSubmitting: (isSubmitting: boolean) => void;
  runSubmitValidation: () => Promise<{ state: FormRuntimeState; hasError: boolean }>;
}

export function createFormStore(fields: FormField[], resolver?: FormResolver, errorMessages?: ErrorMessageTemplates) {
  return createStore<FormStore>()((set, getStore) => ({
    values: getDefaultValues(fields),
    errors: {},
    validatingFields: [],
    isSubmitting: false,

    setFieldValue: async (name, rawValue) => {
      const field = fields.find((f) => f.name === name);
      const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;

      // Update value immediately
      set((state) => ({
        values: setPathValue(state.values, name, normalizedValue),
        validatingFields: [...state.validatingFields, name],
      }));

      try {
        const currentValues = getStore().values;
        const error = await validateFieldByName(fields, name, normalizedValue, resolver, currentValues, errorMessages);
        set((state) => ({
          errors: { ...state.errors, [name]: error || '' },
          validatingFields: state.validatingFields.filter((f) => f !== name),
        }));
      } catch (err) {
        set((state) => ({
          validatingFields: state.validatingFields.filter((f) => f !== name),
        }));
      }
    },

    setFieldBlur: async (name) => {
      set((state) => ({
        validatingFields: [...state.validatingFields, name],
      }));

      try {
        const currentValues = getStore().values;
        const value = get(currentValues, name);
        const error = await validateFieldByName(fields, name, value, resolver, currentValues, errorMessages);
        set((state) => ({
          errors: { ...state.errors, [name]: error || '' },
          validatingFields: state.validatingFields.filter((f) => f !== name),
        }));
      } catch (err) {
        set((state) => ({
          validatingFields: state.validatingFields.filter((f) => f !== name),
        }));
      }
    },

    setSubmitting: (isSubmitting) => set({ isSubmitting }),

    runSubmitValidation: async () => {
      set({ isSubmitting: true });
      const state = getStore();
      const errors = await validateForm(fields, state.values, resolver, errorMessages);
      const hasError = Object.keys(errors).length > 0;

      set({
        errors,
        isSubmitting: false,
      });

      return {
        state: getStore(),
        hasError,
      };
    },
  }));
}
