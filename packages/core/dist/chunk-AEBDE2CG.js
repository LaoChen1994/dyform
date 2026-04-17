import {
  flattenElements,
  get,
  getDefaultValues,
  normalizeFieldValue,
  set,
  validateFieldByName,
  validateForm
} from "./chunk-7GZLKEKI.js";

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
function createFormEngine(schemaOrFields, resolver, errorMessages) {
  const isSchema = schemaOrFields && !Array.isArray(schemaOrFields);
  const schema = isSchema ? schemaOrFields : void 0;
  const fields = Array.isArray(schemaOrFields) ? schemaOrFields : schema?.elements ? flattenElements(schema.elements) : schema?.fields || [];
  const store = createStore({
    values: getDefaultValues(fields),
    errors: {},
    touched: {},
    validatingFields: [],
    isSubmitting: false,
    fieldProps: {}
  });
  const { getState, setState } = store;
  const changeListeners = {};
  const subscribeToChange = (name, listener) => {
    if (!changeListeners[name]) changeListeners[name] = /* @__PURE__ */ new Set();
    changeListeners[name].add(listener);
    return () => changeListeners[name].delete(listener);
  };
  const setFieldProps = (name, props) => {
    setState((s) => ({
      fieldProps: {
        ...s.fieldProps,
        [name]: {
          ...s.fieldProps[name],
          ...props
        }
      }
    }));
  };
  const setFieldValue = async (name, rawValue) => {
    const field = fields.find((f) => f.name === name);
    const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;
    setState((s) => ({
      values: set(s.values, name, normalizedValue),
      touched: { ...s.touched, [name]: true }
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
    if (changeListeners[name] && engine) {
      changeListeners[name].forEach((listener) => listener({ value: normalizedValue, engine }));
    }
    const dependentFields = fields.filter((f) => f.dependencies?.includes(name));
    for (const df of dependentFields) {
      const dfValue = get(getState().values, df.name);
      validateFieldByName(fields, df.name, dfValue, resolver, getState().values, errorMessages).then((err) => {
        setState((s) => ({
          errors: { ...s.errors, [df.name]: err || "" }
        }));
      }).catch(() => {
      });
    }
  };
  const setFieldBlur = async (name) => {
    setState((s) => ({
      validatingFields: [...s.validatingFields, name],
      touched: { ...s.touched, [name]: true }
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
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setState((s) => ({
      errors,
      touched: { ...s.touched, ...allTouched },
      isSubmitting: false
    }));
    return {
      state: getState(),
      hasError
    };
  };
  const engine = {
    store,
    setFieldValue,
    setFieldBlur,
    setSubmitting,
    runSubmitValidation,
    setFieldProps,
    subscribeToChange
  };
  if (schema?.effects) {
    schema.effects(engine);
  }
  return engine;
}

export {
  createStore,
  createFormEngine
};
