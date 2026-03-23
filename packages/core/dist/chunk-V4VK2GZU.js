import {
  get,
  getDefaultValues,
  normalizeFieldValue,
  set,
  validateFieldByName,
  validateForm
} from "./chunk-T3LQTNYY.js";

// src/formState.ts
function createStore(initialState) {
  let state = initialState;
  const listeners = /* @__PURE__ */ new Set();
  const getState = () => state;
  const setState = (partial) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const prevState = state;
      state = { ...state, ...nextState };
      listeners.forEach((listener) => listener(state, prevState));
    }
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, setState, subscribe };
}
function createFormEngine(fields, resolver, errorMessages) {
  const store = createStore({
    values: getDefaultValues(fields),
    errors: {},
    validatingFields: [],
    isSubmitting: false
  });
  const { getState, setState } = store;
  const setFieldValue = async (name, rawValue) => {
    const field = fields.find((f) => f.name === name);
    const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;
    setState((s) => ({
      values: set(s.values, name, normalizedValue)
    }));
    const hasExistingError = !!getState().errors[name];
    const shouldValidateImmediately = field && ["select", "checkbox", "radio", "switch", "date"].includes(field.type);
    if (shouldValidateImmediately || hasExistingError) {
      setState((s) => ({
        validatingFields: [...s.validatingFields, name]
      }));
      try {
        const currentValues = getState().values;
        const error = await validateFieldByName(fields, name, normalizedValue, resolver, currentValues, errorMessages);
        setState((s) => ({
          errors: { ...s.errors, [name]: error || "" },
          validatingFields: s.validatingFields.filter((f) => f !== name)
        }));
      } catch {
        setState((s) => ({
          validatingFields: s.validatingFields.filter((f) => f !== name)
        }));
      }
    }
  };
  const setFieldBlur = async (name) => {
    setState((s) => ({
      validatingFields: [...s.validatingFields, name]
    }));
    try {
      const currentValues = getState().values;
      const value = get(currentValues, name);
      const error = await validateFieldByName(fields, name, value, resolver, currentValues, errorMessages);
      setState((s) => ({
        errors: { ...s.errors, [name]: error || "" },
        validatingFields: s.validatingFields.filter((f) => f !== name)
      }));
    } catch {
      setState((s) => ({
        validatingFields: s.validatingFields.filter((f) => f !== name)
      }));
    }
  };
  const setSubmitting = (isSubmitting) => setState({ isSubmitting });
  const runSubmitValidation = async () => {
    setState({ isSubmitting: true });
    const currentValues = getState().values;
    const errors = await validateForm(fields, currentValues, resolver, errorMessages);
    const hasError = Object.keys(errors).length > 0;
    setState({
      errors,
      isSubmitting: false
    });
    return {
      state: getState(),
      hasError
    };
  };
  return {
    store,
    setFieldValue,
    setFieldBlur,
    setSubmitting,
    runSubmitValidation
  };
}

export {
  createStore,
  createFormEngine
};
