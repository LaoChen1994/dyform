"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createFormEngine: () => createFormEngine,
  createStore: () => createStore,
  defaultErrorMessages: () => defaultErrorMessages,
  get: () => get,
  getDefaultValues: () => getDefaultValues,
  normalizeFieldValue: () => normalizeFieldValue,
  set: () => set,
  validateField: () => validateField,
  validateFieldByName: () => validateFieldByName,
  validateForm: () => validateForm
});
module.exports = __toCommonJS(index_exports);

// src/utils.ts
function parseNumberish(value) {
  if (typeof value === "number") return Number.isNaN(value) ? null : value;
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}
var defaultErrorMessages = {
  required: "{label} is required",
  min: "{label} must be at least {value}",
  max: "{label} must be at most {value}",
  email: "Invalid email address",
  pattern: "Invalid format",
  custom: "Invalid value"
};
function formatMessage(template, field, rule) {
  if (!template) return "";
  return template.replace("{label}", field.label).replace("{value}", String(rule.value || ""));
}
function get(obj, path, defaultValue) {
  if (!path) return defaultValue;
  const keys = path.split(/[.[\]]/).filter(Boolean);
  let result = obj;
  for (const key of keys) {
    if (result === null || result === void 0) return defaultValue;
    result = result[key];
  }
  return result === void 0 ? defaultValue : result;
}
function set(obj, path, value) {
  if (Object(obj) !== obj) return obj;
  const keys = path.split(/[.[\]]/).filter(Boolean);
  const newObj = { ...obj };
  let current = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextKeyIndex = /^\d+$/.test(nextKey);
    if (!(key in current) || current[key] === null || typeof current[key] !== "object") {
      current[key] = isNextKeyIndex ? [] : {};
    } else {
      current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return newObj;
}
function normalizeFieldValue(field, value) {
  if (field.type !== "number") return value;
  if (value === "" || value === void 0 || value === null) return "";
  const numericValue = parseNumberish(value);
  return numericValue === null ? value : numericValue;
}
async function validateField(value, field, customMessages) {
  if (!field.validations) return null;
  const messages = { ...defaultErrorMessages, ...customMessages };
  for (const rule of field.validations) {
    switch (rule.type) {
      case "required":
        if (value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0) {
          return rule.message || formatMessage(messages.required, field, rule);
        }
        break;
      case "min":
        if (field.type === "number") {
          const numericValue = parseNumberish(value);
          if (numericValue !== null && numericValue < rule.value) {
            const template = field.type === "number" ? messages.min : typeof value === "string" ? "{label} must be at least {value} characters" : messages.min;
            return rule.message || formatMessage(template, field, rule);
          }
          break;
        }
        if (typeof value === "number" && value < rule.value) {
          return rule.message || formatMessage(messages.min, field, rule);
        }
        if (typeof value === "string" && value.length < rule.value) {
          const template = "{label} must be at least {value} characters";
          return rule.message || formatMessage(template, field, rule);
        }
        break;
      case "max":
        if (field.type === "number") {
          const numericValue = parseNumberish(value);
          if (numericValue !== null && numericValue > rule.value) {
            return rule.message || formatMessage(messages.max, field, rule);
          }
          break;
        }
        if (typeof value === "number" && value > rule.value) {
          return rule.message || formatMessage(messages.max, field, rule);
        }
        if (typeof value === "string" && value.length > rule.value) {
          const template = "{label} must be at most {value} characters";
          return rule.message || formatMessage(template, field, rule);
        }
        break;
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return rule.message || formatMessage(messages.email, field, rule);
        }
        break;
      }
      case "pattern":
        if (value && rule.value && !new RegExp(rule.value).test(value)) {
          return rule.message || formatMessage(messages.pattern, field, rule);
        }
        break;
      case "custom":
        if (rule.validator) {
          const result = await rule.validator(value);
          if (typeof result === "string") return result;
          if (result === false) return rule.message || formatMessage(messages.custom, field, rule);
        }
        break;
    }
  }
  return null;
}
async function validateFieldByName(fields, name, value, resolver, allValues, customMessages) {
  if (resolver && allValues) {
    const resolverErrors = await resolver(allValues);
    if (resolverErrors[name]) return resolverErrors[name];
  }
  const field = fields.find((f) => f.name === name);
  if (!field) return null;
  return await validateField(value, field, customMessages);
}
async function validateForm(fields, values, resolver, customMessages) {
  let errors = {};
  if (resolver) {
    errors = await resolver(values);
  }
  const validationPromises = fields.map(async (field) => {
    if (errors[field.name]) return;
    const isHidden = typeof field.hidden === "function" ? field.hidden(values) : field.hidden;
    if (isHidden) return;
    const error = await validateField(get(values, field.name), field, customMessages);
    if (error) errors[field.name] = error;
  });
  await Promise.all(validationPromises);
  return errors;
}
function getDefaultValues(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue !== void 0 ? field.defaultValue : field.type === "checkbox" ? [] : "";
    return acc;
  }, {});
}

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createFormEngine,
  createStore,
  defaultErrorMessages,
  get,
  getDefaultValues,
  normalizeFieldValue,
  set,
  validateField,
  validateFieldByName,
  validateForm
});
