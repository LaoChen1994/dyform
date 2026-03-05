import {
  get,
  getDefaultValues,
  normalizeFieldValue,
  set,
  validateFieldByName,
  validateForm
} from "./chunk-KA6QUMVR.js";

// src/formState.ts
import { createStore } from "zustand/vanilla";
function createFormStore(fields, resolver, errorMessages) {
  return createStore()((set2, getStore) => ({
    values: getDefaultValues(fields),
    errors: {},
    validatingFields: [],
    isSubmitting: false,
    setFieldValue: async (name, rawValue) => {
      const field = fields.find((f) => f.name === name);
      const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;
      set2((state) => ({
        values: set(state.values, name, normalizedValue),
        validatingFields: [...state.validatingFields, name]
      }));
      try {
        const currentValues = getStore().values;
        const error = await validateFieldByName(fields, name, normalizedValue, resolver, currentValues, errorMessages);
        set2((state) => ({
          errors: { ...state.errors, [name]: error || "" },
          validatingFields: state.validatingFields.filter((f) => f !== name)
        }));
      } catch (err) {
        set2((state) => ({
          validatingFields: state.validatingFields.filter((f) => f !== name)
        }));
      }
    },
    setFieldBlur: async (name) => {
      set2((state) => ({
        validatingFields: [...state.validatingFields, name]
      }));
      try {
        const currentValues = getStore().values;
        const value = get(currentValues, name);
        const error = await validateFieldByName(fields, name, value, resolver, currentValues, errorMessages);
        set2((state) => ({
          errors: { ...state.errors, [name]: error || "" },
          validatingFields: state.validatingFields.filter((f) => f !== name)
        }));
      } catch (err) {
        set2((state) => ({
          validatingFields: state.validatingFields.filter((f) => f !== name)
        }));
      }
    },
    setSubmitting: (isSubmitting) => set2({ isSubmitting }),
    runSubmitValidation: async () => {
      set2({ isSubmitting: true });
      const state = getStore();
      const errors = await validateForm(fields, state.values, resolver, errorMessages);
      const hasError = Object.keys(errors).length > 0;
      set2({
        errors,
        isSubmitting: false
      });
      return {
        state: getStore(),
        hasError
      };
    }
  }));
}

export {
  createFormStore
};
