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
  flattenElements: () => flattenElements,
  flattenElementsWithValues: () => flattenElementsWithValues,
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
function flattenElements(elements) {
  if (!elements) return [];
  const fields = [];
  for (const el of elements) {
    if (el.nodeType === "group" || el.nodeType === "grid") {
      fields.push(...flattenElements(el.elements));
    } else {
      fields.push(el);
    }
  }
  return fields;
}
function flattenElementsWithValues(elements, values, parentPath = "") {
  if (!elements) return [];
  const fields = [];
  for (const el of elements) {
    if (el.nodeType === "group" || el.nodeType === "grid") {
      fields.push(...flattenElementsWithValues(el.elements, values, parentPath));
    } else if (el.nodeType === "list") {
      const listName = el.name;
      const fullListPath = parentPath ? `${parentPath}.${listName}` : listName;
      const listValue = get(values, fullListPath);
      if (Array.isArray(listValue)) {
        for (let i = 0; i < listValue.length; i++) {
          const rowPath = `${fullListPath}[${i}]`;
          fields.push(...flattenElementsWithValues(el.elements, values, rowPath));
        }
      }
    } else {
      const field = el;
      const fieldName = field.name;
      const fullFieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
      fields.push({
        ...field,
        name: fullFieldPath
      });
    }
  }
  return fields;
}

// src/expression.ts
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  const len = expr.length;
  while (i < len) {
    const char = expr[i];
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    if (char === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }
    if (char === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }
    if (char === "'" || char === '"') {
      const quote = char;
      let val = "";
      i++;
      while (i < len && expr[i] !== quote) {
        if (expr[i] === "\\" && i + 1 < len) {
          val += expr[i + 1];
          i += 2;
        } else {
          val += expr[i];
          i++;
        }
      }
      if (i >= len) {
        throw new Error("Unterminated string literal in expression");
      }
      i++;
      tokens.push({ type: "STRING", value: val });
      continue;
    }
    if (expr.substring(i, i + 7) === "$values") {
      let start = i;
      i += 7;
      while (i < len && /[a-zA-Z0-9_.[\]]/.test(expr[i])) {
        i++;
      }
      const valPath = expr.substring(start, i);
      tokens.push({ type: "VARIABLE", value: valPath });
      continue;
    }
    if (expr.substring(i, i + 3) === "===" || expr.substring(i, i + 3) === "!==") {
      tokens.push({ type: "OPERATOR", value: expr.substring(i, i + 3) });
      i += 3;
      continue;
    }
    if (expr.substring(i, i + 2) === ">=" || expr.substring(i, i + 2) === "<=" || expr.substring(i, i + 2) === "==" || expr.substring(i, i + 2) === "!=" || expr.substring(i, i + 2) === "&&" || expr.substring(i, i + 2) === "||") {
      tokens.push({ type: "OPERATOR", value: expr.substring(i, i + 2) });
      i += 2;
      continue;
    }
    if (char === ">" || char === "<" || char === "!") {
      tokens.push({ type: "OPERATOR", value: char });
      i++;
      continue;
    }
    if (/[0-9]/.test(char)) {
      let val = "";
      while (i < len && /[0-9.]/.test(expr[i])) {
        val += expr[i];
        i++;
      }
      tokens.push({ type: "NUMBER", value: val });
      continue;
    }
    if (/[a-zA-Z]/.test(char)) {
      let val = "";
      while (i < len && /[a-zA-Z]/.test(expr[i])) {
        val += expr[i];
        i++;
      }
      if (val === "true" || val === "false") {
        tokens.push({ type: "BOOLEAN", value: val });
      } else if (val === "null") {
        tokens.push({ type: "NULL", value: val });
      } else if (val === "undefined") {
        tokens.push({ type: "UNDEFINED", value: val });
      } else {
        throw new Error(`Unexpected identifier in expression: ${val}`);
      }
      continue;
    }
    throw new Error(`Unexpected character in expression: ${char}`);
  }
  tokens.push({ type: "EOF", value: "" });
  return tokens;
}
var Parser = class {
  tokens;
  current = 0;
  constructor(tokens) {
    this.tokens = tokens;
  }
  peek() {
    return this.tokens[this.current];
  }
  previous() {
    return this.tokens[this.current - 1];
  }
  isAtEnd() {
    return this.peek().type === "EOF";
  }
  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }
  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }
  /**
   * Entry Point: expression -> logicalOr
   */
  parse() {
    return this.logicalOr();
  }
  /**
   * logicalOr -> logicalAnd ( '||' logicalAnd )*
   */
  logicalOr() {
    let expr = this.logicalAnd();
    while (this.peek().type === "OPERATOR" && this.peek().value === "||") {
      const op = this.advance().value;
      const right = this.logicalAnd();
      expr = { type: "BinaryExpression", operator: op, left: expr, right };
    }
    return expr;
  }
  /**
   * logicalAnd -> equality ( '&&' equality )*
   */
  logicalAnd() {
    let expr = this.equality();
    while (this.peek().type === "OPERATOR" && this.peek().value === "&&") {
      const op = this.advance().value;
      const right = this.equality();
      expr = { type: "BinaryExpression", operator: op, left: expr, right };
    }
    return expr;
  }
  /**
   * equality -> comparison ( ( '===' | '!==' | '==' | '!=' ) comparison )*
   */
  equality() {
    let expr = this.comparison();
    while (this.peek().type === "OPERATOR" && ["===", "!==", "==", "!="].includes(this.peek().value)) {
      const op = this.advance().value;
      const right = this.comparison();
      expr = { type: "BinaryExpression", operator: op, left: expr, right };
    }
    return expr;
  }
  /**
   * comparison -> unary ( ( '>' | '>=' | '<' | '<=' ) unary )*
   */
  comparison() {
    let expr = this.unary();
    while (this.peek().type === "OPERATOR" && [">", ">=", "<", "<="].includes(this.peek().value)) {
      const op = this.advance().value;
      const right = this.unary();
      expr = { type: "BinaryExpression", operator: op, left: expr, right };
    }
    return expr;
  }
  /**
   * unary -> ( '!' ) unary | primary
   */
  unary() {
    if (this.peek().type === "OPERATOR" && this.peek().value === "!") {
      const op = this.advance().value;
      const right = this.unary();
      return { type: "UnaryExpression", operator: op, argument: right };
    }
    return this.primary();
  }
  /**
   * primary -> NUMBER | STRING | BOOLEAN | NULL | UNDEFINED | VARIABLE | '(' expression ')'
   */
  primary() {
    if (this.match("NUMBER")) {
      return { type: "Literal", value: Number(this.previous().value) };
    }
    if (this.match("STRING")) {
      return { type: "Literal", value: this.previous().value };
    }
    if (this.match("BOOLEAN")) {
      return { type: "Literal", value: this.previous().value === "true" };
    }
    if (this.match("NULL")) {
      return { type: "Literal", value: null };
    }
    if (this.match("UNDEFINED")) {
      return { type: "Literal", value: void 0 };
    }
    if (this.match("VARIABLE")) {
      const path = this.previous().value;
      return { type: "Identifier", path };
    }
    if (this.match("LPAREN")) {
      const expr = this.parse();
      this.consume("RPAREN", "Expect ')' after expression.");
      return expr;
    }
    throw new Error(`Expect expression, found: ${this.peek().value || "EOF"}`);
  }
};
function evaluateAST(node, context) {
  switch (node.type) {
    case "Literal":
      return node.value;
    case "Identifier": {
      if (node.path === "$values") return context.values;
      const cleanPath = node.path.substring(8);
      return get(context.values, cleanPath);
    }
    case "UnaryExpression": {
      const argValue = evaluateAST(node.argument, context);
      if (node.operator === "!") {
        return !argValue;
      }
      throw new Error(`Unsupported unary operator: ${node.operator}`);
    }
    case "BinaryExpression": {
      const leftVal = evaluateAST(node.left, context);
      if (node.operator === "&&") {
        return leftVal && evaluateAST(node.right, context);
      }
      if (node.operator === "||") {
        return leftVal || evaluateAST(node.right, context);
      }
      const rightVal = evaluateAST(node.right, context);
      switch (node.operator) {
        case "===":
          return leftVal === rightVal;
        case "!==":
          return leftVal !== rightVal;
        case "==":
          return leftVal == rightVal;
        // eslint-disable-line eqeqeq
        case "!=":
          return leftVal != rightVal;
        // eslint-disable-line eqeqeq
        case ">":
          return leftVal > rightVal;
        case ">=":
          return leftVal >= rightVal;
        case "<":
          return leftVal < rightVal;
        case "<=":
          return leftVal <= rightVal;
        default:
          throw new Error(`Unsupported binary operator: ${node.operator}`);
      }
    }
    default:
      throw new Error("Unsupported AST node");
  }
}
function evaluateExpression(expr, context) {
  if (!expr || typeof expr !== "string") return false;
  const trimmed = expr.trim();
  if (trimmed === "") return false;
  try {
    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return !!evaluateAST(ast, context);
  } catch (err) {
    console.error(`Failed to parse/evaluate expression: "${expr}"`, err);
    return false;
  }
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
function createFormEngine(schemaOrFields, resolver, errorMessages) {
  const isSchema = schemaOrFields && !Array.isArray(schemaOrFields);
  const schema = isSchema ? schemaOrFields : void 0;
  const formValidateOn = schema?.validateOn;
  const hiddenFieldStrategy = schema?.hiddenFieldStrategy || "keep";
  const getActiveFields = (values) => {
    if (Array.isArray(schemaOrFields)) return schemaOrFields;
    if (schema?.elements) {
      return flattenElementsWithValues(schema.elements, values);
    }
    return schema?.fields || [];
  };
  const evaluateDynamicProps = (values, fieldProps, currentComputed) => {
    const nextComputed = { ...currentComputed };
    let changed = false;
    const currentFields = getActiveFields(values);
    for (const field of currentFields) {
      const runtimeProps = fieldProps[field.name] || {};
      const hiddenDef = runtimeProps.hidden !== void 0 ? runtimeProps.hidden : field.hidden;
      let nextHidden = false;
      if (typeof hiddenDef === "function") {
        nextHidden = hiddenDef(values);
      } else if (typeof hiddenDef === "string") {
        nextHidden = evaluateExpression(hiddenDef, { values });
      } else if (hiddenDef !== void 0) {
        nextHidden = !!hiddenDef;
      }
      const disabledDef = runtimeProps.disabled !== void 0 ? runtimeProps.disabled : field.disabled;
      let nextDisabled = false;
      if (typeof disabledDef === "function") {
        nextDisabled = disabledDef(values);
      } else if (typeof disabledDef === "string") {
        nextDisabled = evaluateExpression(disabledDef, { values });
      } else if (disabledDef !== void 0) {
        nextDisabled = !!disabledDef;
      }
      const prev = nextComputed[field.name];
      if (!prev || prev.hidden !== nextHidden || prev.disabled !== nextDisabled) {
        nextComputed[field.name] = { hidden: nextHidden, disabled: nextDisabled };
        changed = true;
      }
    }
    return { nextComputed, changed };
  };
  const getInitialValues = () => {
    if (schema?.elements) {
      const initVals = {};
      const fill = (elts, target) => {
        for (const el of elts) {
          if (el.nodeType === "group" || el.nodeType === "grid") {
            fill(el.elements, target);
          } else if (el.nodeType === "list") {
            target[el.name] = el.defaultValue !== void 0 ? el.defaultValue : [];
          } else {
            const f = el;
            target[f.name] = f.defaultValue !== void 0 ? f.defaultValue : f.type === "checkbox" ? [] : "";
          }
        }
      };
      fill(schema.elements, initVals);
      return initVals;
    }
    const fallbackFields = Array.isArray(schemaOrFields) ? schemaOrFields : schema?.fields || [];
    return getDefaultValues(fallbackFields);
  };
  const initialValues = getInitialValues();
  const initialFieldProps = {};
  const { nextComputed: initialComputed } = evaluateDynamicProps(initialValues, initialFieldProps, {});
  const store = createStore({
    values: initialValues,
    errors: {},
    touched: {},
    validatingFields: [],
    isSubmitting: false,
    fieldProps: initialFieldProps,
    computedStates: initialComputed
  });
  const { getState, setState } = store;
  const changeListeners = {};
  const validationRequests = {};
  const subscribeToChange = (name, listener) => {
    if (!changeListeners[name]) changeListeners[name] = /* @__PURE__ */ new Set();
    changeListeners[name].add(listener);
    return () => changeListeners[name].delete(listener);
  };
  const setFieldProps = (name, props) => {
    setState((s) => {
      const nextFieldProps = {
        ...s.fieldProps,
        [name]: {
          ...s.fieldProps[name],
          ...props
        }
      };
      const { nextComputed } = evaluateDynamicProps(s.values, nextFieldProps, s.computedStates);
      return {
        fieldProps: nextFieldProps,
        computedStates: nextComputed
      };
    });
  };
  const getFieldValidateOn = (field) => field?.validateOn || formValidateOn;
  const shouldValidateOnChange = (field, hasExistingError) => {
    const validateOn = getFieldValidateOn(field);
    if (validateOn) return validateOn === "change" || validateOn === "change-blur";
    return !!field && (["select", "checkbox", "radio", "switch", "date"].includes(field.type) || !!hasExistingError);
  };
  const shouldValidateOnBlur = (field) => {
    const validateOn = getFieldValidateOn(field);
    if (validateOn) return validateOn === "blur" || validateOn === "change-blur";
    return true;
  };
  const getEmptyFieldValue = (field) => field.type === "checkbox" ? [] : "";
  const deletePathValue = (values, path) => {
    const keys = path.split(/[.[\]]/).filter(Boolean);
    if (keys.length === 0) return values;
    const nextValues = { ...values };
    let current = nextValues;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (current[key] === null || typeof current[key] !== "object") return nextValues;
      current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
      current = current[key];
    }
    delete current[keys[keys.length - 1]];
    return nextValues;
  };
  const getSubmitValues = (values) => {
    if (hiddenFieldStrategy === "keep") return values;
    let submitValues = values;
    const currentFields = getActiveFields(values);
    for (const field of currentFields) {
      const isHidden = typeof field.hidden === "function" ? field.hidden(values) : field.hidden;
      if (!isHidden) continue;
      submitValues = hiddenFieldStrategy === "omit" ? deletePathValue(submitValues, field.name) : set(submitValues, field.name, getEmptyFieldValue(field));
    }
    return submitValues;
  };
  const validateSingleField = async (name, value, allValues, shouldTrackValidating) => {
    const requestId = (validationRequests[name] || 0) + 1;
    validationRequests[name] = requestId;
    if (shouldTrackValidating) {
      setState((s) => ({
        validatingFields: s.validatingFields.includes(name) ? s.validatingFields : [...s.validatingFields, name]
      }));
    }
    try {
      const currentFields = getActiveFields(allValues);
      const error = await validateFieldByName(currentFields, name, value, resolver, allValues, errorMessages);
      if (validationRequests[name] !== requestId) return;
      setState((s) => ({
        errors: { ...s.errors, [name]: error || "" },
        validatingFields: s.validatingFields.filter((f) => f !== name)
      }));
    } catch {
      if (validationRequests[name] !== requestId) return;
      setState((s) => ({
        validatingFields: s.validatingFields.filter((f) => f !== name)
      }));
    }
  };
  const setFieldValue = async (name, rawValue) => {
    const currentFields = getActiveFields(getState().values);
    const field = currentFields.find((f) => f.name === name);
    const normalizedValue = field ? normalizeFieldValue(field, rawValue) : rawValue;
    setState((s) => {
      const nextValues = set(s.values, name, normalizedValue);
      const { nextComputed } = evaluateDynamicProps(nextValues, s.fieldProps, s.computedStates);
      return {
        values: nextValues,
        touched: { ...s.touched, [name]: true },
        computedStates: nextComputed
      };
    });
    const hasExistingError = !!getState().errors[name];
    if (shouldValidateOnChange(field, hasExistingError)) {
      await validateSingleField(name, normalizedValue, getState().values, true);
    }
    if (changeListeners[name] && engine) {
      changeListeners[name].forEach((listener) => listener({ value: normalizedValue, engine }));
    }
    const nextFields = getActiveFields(getState().values);
    const dependentFields = nextFields.filter((f) => f.dependencies?.includes(name));
    for (const df of dependentFields) {
      const dfValue = get(getState().values, df.name);
      if (getFieldValidateOn(df) !== "submit") {
        validateSingleField(df.name, dfValue, getState().values, false);
      }
    }
  };
  const setFieldBlur = async (name) => {
    setState((s) => ({
      touched: { ...s.touched, [name]: true }
    }));
    const currentValues = getState().values;
    const currentFields = getActiveFields(currentValues);
    const field = currentFields.find((f) => f.name === name);
    if (shouldValidateOnBlur(field)) {
      await validateSingleField(name, get(currentValues, name), currentValues, true);
    }
  };
  const setSubmitting = (isSubmitting) => setState({ isSubmitting });
  const resetForm = () => {
    const freshValues = getInitialValues();
    const currentFields = getActiveFields(freshValues);
    currentFields.forEach((field) => {
      validationRequests[field.name] = (validationRequests[field.name] || 0) + 1;
    });
    setState((s) => {
      const { nextComputed } = evaluateDynamicProps(freshValues, s.fieldProps, {});
      return {
        values: freshValues,
        errors: {},
        touched: {},
        validatingFields: [],
        isSubmitting: false,
        computedStates: nextComputed
      };
    });
  };
  const runSubmitValidation = async () => {
    setState({ isSubmitting: true });
    const currentValues = getState().values;
    const submitValues = getSubmitValues(currentValues);
    const currentFields = getActiveFields(submitValues);
    const errors = await validateForm(currentFields, submitValues, resolver, errorMessages);
    const hasError = Object.keys(errors).length > 0;
    const allTouched = currentFields.reduce((acc, field) => {
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
      hasError,
      values: submitValues
    };
  };
  const appendListItem = (name, defaultVal = {}) => {
    setState((s) => {
      const currentList = get(s.values, name) || [];
      const nextList = [...currentList, defaultVal];
      const nextValues = set(s.values, name, nextList);
      const { nextComputed } = evaluateDynamicProps(nextValues, s.fieldProps, s.computedStates);
      return {
        values: nextValues,
        computedStates: nextComputed
      };
    });
  };
  const removeListItem = (name, index) => {
    setState((s) => {
      const currentList = get(s.values, name) || [];
      const nextList = currentList.filter((_, i) => i !== index);
      const nextValues = set(s.values, name, nextList);
      const cleanPrefix = `${name}[${index}]`;
      const nextErrors = { ...s.errors };
      const nextTouched = { ...s.touched };
      const nextFieldProps = { ...s.fieldProps };
      const nextComputed = { ...s.computedStates };
      const adjustStateKeys = (record, prefix) => {
        const nextRecord = { ...record };
        for (const key of Object.keys(nextRecord)) {
          if (key.startsWith(prefix)) {
            const regex = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\[(\\d+)\\](.*)`);
            const match = key.match(regex);
            if (match) {
              const itemIndex = parseInt(match[1], 10);
              const suffix = match[2];
              if (itemIndex === index) {
                delete nextRecord[key];
              } else if (itemIndex > index) {
                const newKey = `${name}[${itemIndex - 1}]${suffix}`;
                nextRecord[newKey] = nextRecord[key];
                delete nextRecord[key];
              }
            }
          }
        }
        return nextRecord;
      };
      const finalErrors = adjustStateKeys(nextErrors, `${name}[`);
      const finalTouched = adjustStateKeys(nextTouched, `${name}[`);
      const finalFieldProps = adjustStateKeys(nextFieldProps, `${name}[`);
      const finalComputedStates = adjustStateKeys(nextComputed, `${name}[`);
      const { nextComputed: finalComputed } = evaluateDynamicProps(nextValues, finalFieldProps, finalComputedStates);
      return {
        values: nextValues,
        errors: finalErrors,
        touched: finalTouched,
        fieldProps: finalFieldProps,
        computedStates: finalComputed
      };
    });
  };
  const engine = {
    store,
    setFieldValue,
    setFieldBlur,
    setSubmitting,
    runSubmitValidation,
    resetForm,
    setFieldProps,
    subscribeToChange,
    appendListItem,
    removeListItem
  };
  if (schema?.effects) {
    schema.effects(engine);
  }
  return engine;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createFormEngine,
  createStore,
  defaultErrorMessages,
  flattenElements,
  flattenElementsWithValues,
  get,
  getDefaultValues,
  normalizeFieldValue,
  set,
  validateField,
  validateFieldByName,
  validateForm
});
