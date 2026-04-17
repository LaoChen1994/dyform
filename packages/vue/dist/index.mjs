import { defineComponent as p, openBlock as c, createElementBlock as g, mergeProps as I, unref as o, createBlock as h, computed as V, withCtx as f, renderSlot as A, createVNode as b, normalizeClass as U, createElementVNode as X, normalizeProps as ne, guardReactiveProps as re, Fragment as j, renderList as O, createTextVNode as H, toDisplayString as C, createCommentVNode as q, resolveDynamicComponent as oe, ref as de, onUnmounted as ue, withModifiers as ce } from "vue";
import { clsx as me } from "clsx";
import { twMerge as fe } from "tailwind-merge";
import { useForwardProps as K, SelectTrigger as be, SelectIcon as pe, SelectPortal as ge, SelectContent as ye, SelectViewport as ve, SelectItem as he, SelectItemIndicator as xe, SelectItemText as Ve, useForwardPropsEmits as W, SelectRoot as ke, SelectValue as we, CheckboxRoot as Be, CheckboxIndicator as Se, Label as $e, RadioGroupItem as Ie, RadioGroupIndicator as Fe, RadioGroupRoot as Re, SwitchRoot as Ce, SwitchThumb as Pe } from "radix-vue";
import { ChevronDown as qe, Check as te, Circle as De } from "lucide-vue-next";
function Y(e) {
  if (typeof e == "number") return Number.isNaN(e) ? null : e;
  if (typeof e != "string" || e.trim() === "") return null;
  const a = Number(e);
  return Number.isNaN(a) ? null : a;
}
var Ee = {
  required: "{label} is required",
  min: "{label} must be at least {value}",
  max: "{label} must be at most {value}",
  email: "Invalid email address",
  pattern: "Invalid format",
  custom: "Invalid value"
};
function $(e, a, s) {
  return e ? e.replace("{label}", a.label).replace("{value}", String(s.value || "")) : "";
}
function z(e, a, s) {
  if (!a) return s;
  const i = a.split(/[.[\]]/).filter(Boolean);
  let t = e;
  for (const l of i) {
    if (t == null) return s;
    t = t[l];
  }
  return t === void 0 ? s : t;
}
function Ne(e, a, s) {
  if (Object(e) !== e) return e;
  const i = a.split(/[.[\]]/).filter(Boolean), t = { ...e };
  let l = t;
  for (let r = 0; r < i.length - 1; r++) {
    const n = i[r], u = i[r + 1], y = /^\d+$/.test(u);
    !(n in l) || l[n] === null || typeof l[n] != "object" ? l[n] = y ? [] : {} : l[n] = Array.isArray(l[n]) ? [...l[n]] : { ...l[n] }, l = l[n];
  }
  return l[i[i.length - 1]] = s, t;
}
function ae(e, a) {
  if (e.type !== "number") return a;
  if (a === "" || a === void 0 || a === null) return "";
  const s = Y(a);
  return s === null ? a : s;
}
async function le(e, a, s) {
  if (!a.validations) return null;
  const i = { ...Ee, ...s };
  for (const t of a.validations)
    switch (t.type) {
      case "required":
        if (e == null || e === "" || Array.isArray(e) && e.length === 0)
          return t.message || $(i.required, a, t);
        break;
      case "min":
        if (a.type === "number") {
          const l = Y(e);
          if (l !== null && l < t.value) {
            const r = a.type === "number" ? i.min : typeof e == "string" ? "{label} must be at least {value} characters" : i.min;
            return t.message || $(r, a, t);
          }
          break;
        }
        if (typeof e == "number" && e < t.value)
          return t.message || $(i.min, a, t);
        if (typeof e == "string" && e.length < t.value)
          return t.message || $("{label} must be at least {value} characters", a, t);
        break;
      case "max":
        if (a.type === "number") {
          const l = Y(e);
          if (l !== null && l > t.value)
            return t.message || $(i.max, a, t);
          break;
        }
        if (typeof e == "number" && e > t.value)
          return t.message || $(i.max, a, t);
        if (typeof e == "string" && e.length > t.value)
          return t.message || $("{label} must be at most {value} characters", a, t);
        break;
      case "email": {
        if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
          return t.message || $(i.email, a, t);
        break;
      }
      case "pattern":
        if (e && t.value && !new RegExp(t.value).test(e))
          return t.message || $(i.pattern, a, t);
        break;
      case "custom":
        if (t.validator) {
          const l = await t.validator(e);
          if (typeof l == "string") return l;
          if (l === !1) return t.message || $(i.custom, a, t);
        }
        break;
    }
  return null;
}
async function Q(e, a, s, i, t, l) {
  if (i && t) {
    const n = await i(t);
    if (n[a]) return n[a];
  }
  const r = e.find((n) => n.name === a);
  return r ? await le(s, r, l) : null;
}
async function Ae(e, a, s, i) {
  let t = {};
  s && (t = await s(a));
  const l = e.map(async (r) => {
    if (t[r.name] || (typeof r.hidden == "function" ? r.hidden(a) : r.hidden)) return;
    const u = await le(z(a, r.name), r, i);
    u && (t[r.name] = u);
  });
  return await Promise.all(l), t;
}
function Te(e) {
  return e.reduce((a, s) => (a[s.name] = s.defaultValue !== void 0 ? s.defaultValue : s.type === "checkbox" ? [] : "", a), {});
}
function Z(e) {
  if (!e) return [];
  const a = [];
  for (const s of e)
    s.nodeType === "group" || s.nodeType === "grid" ? a.push(...Z(s.elements)) : a.push(s);
  return a;
}
function Ue(e) {
  let a = e;
  const s = /* @__PURE__ */ new Set();
  return { getState: () => a, setState: (r) => {
    const n = typeof r == "function" ? r(a) : r;
    if (!Object.is(n, a)) {
      const u = a;
      a = { ...a, ...n }, s.forEach((y) => y(a, u));
    }
  }, subscribe: (r) => (s.add(r), () => s.delete(r)) };
}
function je(e, a, s) {
  const t = e && !Array.isArray(e) ? e : void 0, l = Array.isArray(e) ? e : t != null && t.elements ? Z(t.elements) : (t == null ? void 0 : t.fields) || [], r = Ue({
    values: Te(l),
    errors: {},
    touched: {},
    validatingFields: [],
    isSubmitting: !1,
    fieldProps: {}
  }), { getState: n, setState: u } = r, y = {}, k = {
    store: r,
    setFieldValue: async (d, m) => {
      const w = l.find((v) => v.name === d), N = w ? ae(w, m) : m;
      u((v) => ({
        values: Ne(v.values, d, N),
        touched: { ...v.touched, [d]: !0 }
      }));
      const R = !!n().errors[d];
      if (w && ["select", "checkbox", "radio", "switch", "date"].includes(w.type) || R) {
        u((v) => ({
          validatingFields: [...v.validatingFields, d]
        }));
        try {
          const v = n().values, P = await Q(l, d, N, a, v, s);
          u((L) => ({
            errors: { ...L.errors, [d]: P || "" },
            validatingFields: L.validatingFields.filter((J) => J !== d)
          }));
        } catch {
          u((v) => ({
            validatingFields: v.validatingFields.filter((P) => P !== d)
          }));
        }
      }
      y[d] && k && y[d].forEach((v) => v({ value: N, engine: k }));
      const ie = l.filter((v) => {
        var P;
        return (P = v.dependencies) == null ? void 0 : P.includes(d);
      });
      for (const v of ie) {
        const P = z(n().values, v.name);
        Q(l, v.name, P, a, n().values, s).then((L) => {
          u((J) => ({
            errors: { ...J.errors, [v.name]: L || "" }
          }));
        }).catch(() => {
        });
      }
    },
    setFieldBlur: async (d) => {
      u((m) => ({
        validatingFields: [...m.validatingFields, d],
        touched: { ...m.touched, [d]: !0 }
      }));
      try {
        const m = n().values, w = z(m, d), N = await Q(l, d, w, a, m, s);
        u((R) => ({
          errors: { ...R.errors, [d]: N || "" },
          validatingFields: R.validatingFields.filter((G) => G !== d)
        }));
      } catch {
        u((m) => ({
          validatingFields: m.validatingFields.filter((w) => w !== d)
        }));
      }
    },
    setSubmitting: (d) => u({ isSubmitting: d }),
    runSubmitValidation: async () => {
      u({ isSubmitting: !0 });
      const d = n().values, m = await Ae(l, d, a, s), w = Object.keys(m).length > 0, N = l.reduce((R, G) => (R[G.name] = !0, R), {});
      return u((R) => ({
        errors: m,
        touched: { ...R.touched, ...N },
        isSubmitting: !1
      })), {
        state: n(),
        hasError: w
      };
    },
    setFieldProps: (d, m) => {
      u((w) => ({
        fieldProps: {
          ...w.fieldProps,
          [d]: {
            ...w.fieldProps[d],
            ...m
          }
        }
      }));
    },
    subscribeToChange: (d, m) => (y[d] || (y[d] = /* @__PURE__ */ new Set()), y[d].add(m), () => y[d].delete(m))
  };
  return t != null && t.effects && t.effects(k), k;
}
function B(...e) {
  return fe(me(e));
}
const ze = ["type", "value"], se = /* @__PURE__ */ p({
  __name: "Input",
  props: {
    class: {},
    type: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: a }) {
    const s = e, i = a;
    return (t, l) => (c(), g("input", I(t.$attrs, {
      type: e.type,
      class: o(B)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", s.class),
      value: e.modelValue,
      onInput: l[0] || (l[0] = (r) => i("update:modelValue", r.target.value)),
      onBlur: l[1] || (l[1] = (r) => i("blur", r))
    }), null, 16, ze));
  }
}), T = /* @__PURE__ */ p({
  __name: "InputRenderer",
  props: {
    field: {},
    fieldId: {},
    modelValue: {},
    ariaInvalid: { type: Boolean },
    ariaRequired: { type: Boolean },
    ariaDescribedby: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: a }) {
    const s = e, i = a, t = (l) => {
      i("update:modelValue", ae(s.field, l));
    };
    return (l, r) => (c(), h(se, {
      id: e.fieldId,
      type: e.field.type,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue ?? "",
      "onUpdate:modelValue": t,
      onBlur: r[0] || (r[0] = (n) => i("blur", n))
    }, null, 8, ["id", "type", "placeholder", "disabled", "name", "model-value"]));
  }
}), Me = ["value"], Ge = /* @__PURE__ */ p({
  __name: "Textarea",
  props: {
    class: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: a }) {
    const s = e, i = a;
    return (t, l) => (c(), g("textarea", I(t.$attrs, {
      class: o(B)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", s.class),
      value: e.modelValue,
      onInput: l[0] || (l[0] = (r) => i("update:modelValue", r.target.value)),
      onBlur: l[1] || (l[1] = (r) => i("blur", r))
    }), null, 16, Me));
  }
}), Le = /* @__PURE__ */ p({
  __name: "TextareaRenderer",
  props: {
    field: {},
    fieldId: {},
    modelValue: {},
    ariaInvalid: { type: Boolean },
    ariaRequired: { type: Boolean },
    ariaDescribedby: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const s = a;
    return (i, t) => (c(), h(Ge, {
      id: e.fieldId,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue ?? "",
      "onUpdate:modelValue": t[0] || (t[0] = (l) => s("update:modelValue", l))
    }, null, 8, ["id", "placeholder", "disabled", "name", "model-value"]));
  }
}), Oe = /* @__PURE__ */ p({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const a = e, s = V(() => {
      const { class: t, ...l } = a;
      return l;
    }), i = K(s);
    return (t, l) => (c(), h(o(be), I(o(i), {
      class: o(B)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", a.class)
    }), {
      default: f(() => [
        A(t.$slots, "default"),
        b(o(pe), { "as-child": "" }, {
          default: f(() => [
            b(o(qe), { class: "h-4 w-4 opacity-50" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), He = /* @__PURE__ */ p({
  __name: "SelectContent",
  props: {
    forceMount: { type: Boolean },
    position: { default: "popper" },
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const a = e, s = V(() => {
      const { class: t, ...l } = a;
      return l;
    }), i = K(s);
    return (t, l) => (c(), h(o(ge), null, {
      default: f(() => [
        b(o(ye), I(o(i), {
          class: o(B)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", a.class)
        }), {
          default: f(() => [
            b(o(ve), {
              class: U(o(B)("p-1", e.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"))
            }, {
              default: f(() => [
                A(t.$slots, "default")
              ]),
              _: 3
            }, 8, ["class"])
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Ke = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, We = /* @__PURE__ */ p({
  __name: "SelectItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const a = e, s = V(() => {
      const { class: t, ...l } = a;
      return l;
    }), i = K(s);
    return (t, l) => (c(), h(o(he), I(o(i), {
      class: o(B)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        a.class
      )
    }), {
      default: f(() => [
        X("span", Ke, [
          b(o(xe), null, {
            default: f(() => [
              b(o(te), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        b(o(Ve), null, {
          default: f(() => [
            A(t.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Je = /* @__PURE__ */ p({
  __name: "Select",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    defaultValue: {},
    modelValue: {},
    dir: {},
    name: {},
    autocomplete: {},
    disabled: { type: Boolean },
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "update:open"],
  setup(e, { emit: a }) {
    const t = W(e, a);
    return (l, r) => (c(), h(o(ke), ne(re(o(t))), {
      default: f(() => [
        A(l.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Qe = /* @__PURE__ */ p({
  __name: "SelectRenderer",
  props: {
    field: {},
    fieldId: {},
    modelValue: {},
    ariaInvalid: { type: Boolean },
    ariaRequired: { type: Boolean },
    ariaDescribedby: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const s = a;
    return (i, t) => (c(), h(Je, {
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": t[0] || (t[0] = (l) => s("update:modelValue", l))
    }, {
      default: f(() => [
        b(Oe, { id: e.fieldId }, {
          default: f(() => [
            b(o(we), {
              placeholder: e.field.placeholder || "Select an option"
            }, null, 8, ["placeholder"])
          ]),
          _: 1
        }, 8, ["id"]),
        b(He, null, {
          default: f(() => [
            (c(!0), g(j, null, O(e.field.options, (l) => (c(), h(We, {
              key: l.value,
              value: String(l.value)
            }, {
              default: f(() => [
                H(C(l.label), 1)
              ]),
              _: 2
            }, 1032, ["value"]))), 128))
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["disabled", "name", "model-value"]));
  }
}), Xe = /* @__PURE__ */ p({
  __name: "Checkbox",
  props: {
    defaultChecked: { type: Boolean },
    checked: { type: [Boolean, String] },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    value: {},
    id: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:checked", "blur"],
  setup(e, { emit: a }) {
    const s = e, i = a, t = V(() => {
      const { class: r, ...n } = s;
      return n;
    }), l = W(t, i);
    return (r, n) => (c(), h(o(Be), I(o(l), {
      class: o(B)("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", s.class),
      onBlur: n[0] || (n[0] = (u) => i("blur"))
    }), {
      default: f(() => [
        b(o(Se), { class: "flex h-full w-full items-center justify-center text-current" }, {
          default: f(() => [
            b(o(te), { class: "h-4 w-4" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), _ = /* @__PURE__ */ p({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const a = e, s = V(() => {
      const { class: i, ...t } = a;
      return t;
    });
    return (i, t) => (c(), h(o($e), I(s.value, {
      class: o(B)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", a.class)
    }), {
      default: f(() => [
        A(i.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ye = { class: "flex flex-wrap gap-4" }, Ze = /* @__PURE__ */ p({
  __name: "CheckboxRenderer",
  props: {
    field: {},
    fieldId: {},
    modelValue: {},
    ariaInvalid: { type: Boolean },
    ariaRequired: { type: Boolean },
    ariaDescribedby: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const s = e, i = a, t = (l, r) => {
      const n = Array.isArray(s.modelValue) ? [...s.modelValue] : [];
      if (r)
        n.push(l);
      else {
        const u = n.indexOf(l);
        u > -1 && n.splice(u, 1);
      }
      i("update:modelValue", n);
    };
    return (l, r) => (c(), g("div", Ye, [
      (c(!0), g(j, null, O(e.field.options, (n) => (c(), g("div", {
        key: n.value,
        class: "flex items-center space-x-2"
      }, [
        b(Xe, {
          id: `checkbox-${e.field.name}-${n.value}`,
          disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
          checked: Array.isArray(e.modelValue) && e.modelValue.includes(n.value),
          "onUpdate:checked": (u) => t(n.value, !!u)
        }, null, 8, ["id", "disabled", "checked", "onUpdate:checked"]),
        b(_, {
          for: `checkbox-${e.field.name}-${n.value}`,
          class: "font-normal"
        }, {
          default: f(() => [
            H(C(n.label), 1)
          ]),
          _: 2
        }, 1032, ["for"])
      ]))), 128))
    ]));
  }
}), _e = /* @__PURE__ */ p({
  __name: "RadioGroupItem",
  props: {
    id: {},
    value: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const a = e, s = V(() => {
      const { class: t, ...l } = a;
      return l;
    }), i = K(s);
    return (t, l) => (c(), h(o(Ie), I(o(i), {
      class: o(B)("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", a.class)
    }), {
      default: f(() => [
        b(o(Fe), { class: "flex items-center justify-center" }, {
          default: f(() => [
            b(o(De), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), et = /* @__PURE__ */ p({
  __name: "RadioGroup",
  props: {
    modelValue: {},
    defaultValue: {},
    disabled: { type: Boolean },
    name: {},
    required: { type: Boolean },
    orientation: {},
    dir: {},
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const s = e, i = a, t = V(() => {
      const { class: r, ...n } = s;
      return n;
    }), l = W(t, i);
    return (r, n) => (c(), h(o(Re), I(o(l), {
      class: o(B)("grid gap-2", s.class)
    }), {
      default: f(() => [
        A(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), tt = /* @__PURE__ */ p({
  __name: "RadioRenderer",
  props: {
    field: {},
    fieldId: {},
    modelValue: {},
    ariaInvalid: { type: Boolean },
    ariaRequired: { type: Boolean },
    ariaDescribedby: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const s = a;
    return (i, t) => (c(), h(et, {
      class: "flex flex-wrap gap-4",
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": t[0] || (t[0] = (l) => s("update:modelValue", l))
    }, {
      default: f(() => [
        (c(!0), g(j, null, O(e.field.options, (l) => (c(), g("div", {
          key: l.value,
          class: "flex items-center space-x-2"
        }, [
          b(_e, {
            id: `radio-${e.field.name}-${l.value}`,
            value: String(l.value)
          }, null, 8, ["id", "value"]),
          b(_, {
            for: `radio-${e.field.name}-${l.value}`,
            class: "font-normal"
          }, {
            default: f(() => [
              H(C(l.label), 1)
            ]),
            _: 2
          }, 1032, ["for"])
        ]))), 128))
      ]),
      _: 1
    }, 8, ["disabled", "name", "model-value"]));
  }
}), at = /* @__PURE__ */ p({
  __name: "DateRenderer",
  props: {
    field: {},
    modelValue: {},
    fieldId: {},
    ariaInvalid: { type: Boolean },
    ariaRequired: { type: Boolean },
    ariaDescribedby: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: a }) {
    const s = a;
    return (i, t) => (c(), h(se, {
      id: e.fieldId,
      type: "date",
      "model-value": e.modelValue,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "aria-invalid": e.ariaInvalid,
      "aria-required": e.ariaRequired,
      "aria-describedby": e.ariaDescribedby,
      "onUpdate:modelValue": t[0] || (t[0] = (l) => s("update:modelValue", l)),
      onBlur: t[1] || (t[1] = (l) => s("blur", l))
    }, null, 8, ["id", "model-value", "placeholder", "disabled", "name", "aria-invalid", "aria-required", "aria-describedby"]));
  }
}), lt = /* @__PURE__ */ p({
  __name: "Switch",
  props: {
    defaultChecked: { type: Boolean },
    checked: { type: Boolean },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    id: {},
    value: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:checked"],
  setup(e, { emit: a }) {
    const s = e, i = a, t = V(() => {
      const { class: r, ...n } = s;
      return n;
    }), l = W(t, i);
    return (r, n) => (c(), h(o(Ce), I(o(l), {
      class: o(B)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        s.class
      )
    }), {
      default: f(() => [
        b(o(Pe), {
          class: U(o(B)(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          ))
        }, null, 8, ["class"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), st = { class: "flex items-center space-x-2" }, it = /* @__PURE__ */ p({
  __name: "SwitchRenderer",
  props: {
    field: {},
    modelValue: { type: Boolean },
    fieldId: {},
    ariaInvalid: { type: Boolean },
    ariaRequired: { type: Boolean },
    ariaDescribedby: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: a }) {
    const s = a;
    return (i, t) => (c(), g("div", st, [
      b(lt, {
        id: e.fieldId,
        checked: e.modelValue,
        disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
        "aria-invalid": e.ariaInvalid,
        "aria-required": e.ariaRequired,
        "aria-describedby": e.ariaDescribedby,
        "onUpdate:checked": t[0] || (t[0] = (l) => s("update:modelValue", l))
      }, null, 8, ["id", "checked", "disabled", "aria-invalid", "aria-required", "aria-describedby"])
    ]));
  }
}), ee = {
  text: T,
  number: T,
  password: T,
  email: T,
  textarea: Le,
  select: Qe,
  checkbox: Ze,
  radio: tt,
  date: at,
  switch: it
}, nt = {
  key: 0,
  class: "text-destructive"
}, rt = ["id"], ot = ["id"], dt = /* @__PURE__ */ p({
  __name: "FormFieldRenderer",
  props: {
    field: {},
    modelValue: {},
    error: {},
    componentMap: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: a }) {
    const s = e, i = a, t = V(() => `field-${s.field.name}`), l = V(() => `${t.value}-description`), r = V(() => `${t.value}-error`), n = V(() => {
      var S;
      return (S = s.field.validations) == null ? void 0 : S.some((F) => F.type === "required");
    }), u = V(() => {
      const S = [];
      return s.field.description && S.push(l.value), s.error && S.push(r.value), S.length > 0 ? S.join(" ") : void 0;
    }), y = V(
      () => s.componentMap ? { ...ee, ...s.componentMap } : ee
    ), M = V(
      () => y.value[s.field.type] ?? T
    );
    return (S, F) => (c(), g("div", {
      class: U(["space-y-2", e.field.className])
    }, [
      e.field.label ? (c(), h(_, {
        key: 0,
        for: t.value,
        class: U(n.value ? "flex items-center gap-1" : "")
      }, {
        default: f(() => [
          H(C(e.field.label) + " ", 1),
          n.value ? (c(), g("span", nt, "*")) : q("", !0)
        ]),
        _: 1
      }, 8, ["for", "class"])) : q("", !0),
      (c(), h(oe(M.value), {
        field: e.field,
        "field-id": t.value,
        "model-value": e.modelValue,
        "aria-invalid": !!e.error,
        "aria-required": n.value,
        "aria-describedby": u.value,
        "onUpdate:modelValue": F[0] || (F[0] = (D) => i("update:modelValue", D)),
        onBlur: F[1] || (F[1] = (D) => i("blur", D))
      }, null, 40, ["field", "field-id", "model-value", "aria-invalid", "aria-required", "aria-describedby"])),
      e.field.description ? (c(), g("p", {
        key: 1,
        id: l.value,
        class: "text-[0.8rem] text-muted-foreground"
      }, C(e.field.description), 9, rt)) : q("", !0),
      e.error ? (c(), g("p", {
        key: 2,
        id: r.value,
        class: "text-[0.8rem] font-medium text-destructive"
      }, C(e.error), 9, ot)) : q("", !0)
    ], 2));
  }
});
function ut({ schema: e }) {
  const a = je(e, e.resolver, e.errorMessages), s = de(a.store.getState()), i = a.store.subscribe((u) => {
    s.value = u;
  });
  return ue(() => {
    i();
  }), {
    engine: a,
    state: s,
    // This is a Ref
    setValue: async (u, y) => {
      await a.setFieldValue(u, y);
    },
    getValue: (u) => z(s.value.values, u),
    validate: async () => {
      const { hasError: u, state: y } = await a.runSubmitValidation();
      return { hasError: u, values: y.values };
    },
    reset: () => {
      a.store.setState({
        values: {},
        errors: {},
        isSubmitting: !1
      });
    }
  };
}
const ct = {
  key: 0,
  class: "space-y-1"
}, mt = {
  key: 0,
  class: "text-2xl font-bold tracking-tight"
}, ft = {
  key: 1,
  class: "text-muted-foreground"
}, bt = { class: "space-y-4" }, pt = ["disabled"], Vt = /* @__PURE__ */ p({
  __name: "DynamicForm",
  props: {
    schema: {},
    className: {},
    form: {}
  },
  emits: ["submit"],
  setup(e, { emit: a }) {
    const s = e, i = a, t = ut({ schema: s.schema }), l = s.form || t, { engine: r, state: n } = l, u = async (x, E) => {
      await r.setFieldValue(x, E);
    }, y = async (x) => {
      await r.setFieldBlur(x);
    }, M = (x) => typeof x.hidden == "function" ? x.hidden(n.value.values) : !!x.hidden, S = (x) => {
      const E = typeof x.disabled == "function" ? x.disabled(n.value.values) : !!x.disabled, k = n.value.validatingFields.includes(x.name);
      return { ...x, disabled: E || k };
    }, F = async () => {
      const { hasError: x, values: E } = await l.validate();
      if (x) {
        const d = Z(s.schema.elements || s.schema.fields || []).find((m) => n.value.errors[m.name]);
        if (d) {
          const m = document.getElementById(`field-${d.name}`);
          m == null || m.focus(), m == null || m.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      await i("submit", E);
    }, D = V(() => n.value.validatingFields.length > 0);
    return (x, E) => (c(), g("form", {
      class: U(["space-y-6", e.className]),
      onSubmit: ce(F, ["prevent"])
    }, [
      e.schema.title || e.schema.description ? (c(), g("div", ct, [
        e.schema.title ? (c(), g("h2", mt, C(e.schema.title), 1)) : q("", !0),
        e.schema.description ? (c(), g("p", ft, C(e.schema.description), 1)) : q("", !0)
      ])) : q("", !0),
      X("div", bt, [
        (c(!0), g(j, null, O(e.schema.fields, (k) => (c(), g(j, {
          key: k.id
        }, [
          M(k) ? q("", !0) : (c(), h(dt, {
            key: 0,
            field: S(k),
            "model-value": o(z)(o(n).values, k.name),
            error: o(n).errors[k.name],
            "onUpdate:modelValue": (d) => u(k.name, d),
            onBlur: (d) => y(k.name)
          }, null, 8, ["field", "model-value", "error", "onUpdate:modelValue", "onBlur"]))
        ], 64))), 128))
      ]),
      X("button", {
        type: "submit",
        disabled: o(n).isSubmitting || D.value,
        class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      }, C(o(n).isSubmitting ? "Submitting..." : D.value ? "Validating..." : e.schema.submitButtonText || "Submit"), 9, pt)
    ], 34));
  }
});
export {
  Vt as DynamicForm,
  dt as FormFieldRenderer,
  ee as defaultComponentMap,
  ut as useForm
};
