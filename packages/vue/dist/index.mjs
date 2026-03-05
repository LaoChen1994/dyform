import { defineComponent as p, openBlock as d, createElementBlock as g, mergeProps as $, unref as o, createBlock as y, computed as h, withCtx as m, renderSlot as q, createVNode as b, normalizeClass as D, createElementVNode as O, normalizeProps as X, guardReactiveProps as Y, Fragment as N, renderList as E, createTextVNode as U, toDisplayString as I, createCommentVNode as R, resolveDynamicComponent as Z, ref as _, onUnmounted as ee, withModifiers as te } from "vue";
import { clsx as ae } from "clsx";
import { twMerge as le } from "tailwind-merge";
import { useForwardProps as j, SelectTrigger as ie, SelectIcon as ne, SelectPortal as se, SelectContent as re, SelectViewport as oe, SelectItem as de, SelectItemIndicator as ue, SelectItemText as ce, useForwardPropsEmits as A, SelectRoot as me, SelectValue as fe, CheckboxRoot as be, CheckboxIndicator as pe, Label as ge, RadioGroupItem as ye, RadioGroupIndicator as ve, RadioGroupRoot as he, SwitchRoot as xe, SwitchThumb as Ve } from "radix-vue";
import { ChevronDown as ke, Check as W, Circle as we } from "lucide-vue-next";
function z(e) {
  if (typeof e == "number") return Number.isNaN(e) ? null : e;
  if (typeof e != "string" || e.trim() === "") return null;
  const l = Number(e);
  return Number.isNaN(l) ? null : l;
}
var Be = {
  required: "{label} is required",
  min: "{label} must be at least {value}",
  max: "{label} must be at most {value}",
  email: "Invalid email address",
  pattern: "Invalid format",
  custom: "Invalid value"
};
function S(e, l, i) {
  return e.replace("{label}", l.label).replace("{value}", String(i.value || ""));
}
function M(e, l, i) {
  if (!l) return i;
  const n = l.split(/[.[\]]/).filter(Boolean);
  let a = e;
  for (const t of n) {
    if (a == null) return i;
    a = a[t];
  }
  return a === void 0 ? i : a;
}
function Se(e, l, i) {
  if (Object(e) !== e) return e;
  const n = l.split(/[.[\]]/).filter(Boolean), a = { ...e };
  let t = a;
  for (let r = 0; r < n.length - 1; r++) {
    const s = n[r], u = n[r + 1], c = /^\d+$/.test(u);
    !(s in t) || t[s] === null || typeof t[s] != "object" ? t[s] = c ? [] : {} : t[s] = Array.isArray(t[s]) ? [...t[s]] : { ...t[s] }, t = t[s];
  }
  return t[n[n.length - 1]] = i, a;
}
function H(e, l) {
  if (e.type !== "number") return l;
  if (l === "" || l === void 0 || l === null) return "";
  const i = z(l);
  return i === null ? l : i;
}
async function J(e, l, i) {
  if (!l.validations) return null;
  const n = { ...Be, ...i };
  for (const a of l.validations)
    switch (a.type) {
      case "required":
        if (e == null || e === "" || Array.isArray(e) && e.length === 0)
          return a.message || S(n.required, l, a);
        break;
      case "min":
        if (l.type === "number") {
          const t = z(e);
          if (t !== null && t < a.value) {
            const r = l.type === "number" ? n.min : typeof e == "string" ? "{label} must be at least {value} characters" : n.min;
            return a.message || S(r, l, a);
          }
          break;
        }
        if (typeof e == "number" && e < a.value)
          return a.message || S(n.min, l, a);
        if (typeof e == "string" && e.length < a.value)
          return a.message || S("{label} must be at least {value} characters", l, a);
        break;
      case "max":
        if (l.type === "number") {
          const t = z(e);
          if (t !== null && t > a.value)
            return a.message || S(n.max, l, a);
          break;
        }
        if (typeof e == "number" && e > a.value)
          return a.message || S(n.max, l, a);
        if (typeof e == "string" && e.length > a.value)
          return a.message || S("{label} must be at most {value} characters", l, a);
        break;
      case "email": {
        if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
          return a.message || S(n.email, l, a);
        break;
      }
      case "pattern":
        if (e && a.value && !new RegExp(a.value).test(e))
          return a.message || S(n.pattern, l, a);
        break;
      case "custom":
        if (a.validator) {
          const t = await a.validator(e);
          if (typeof t == "string") return t;
          if (t === !1) return a.message || S(n.custom, l, a);
        }
        break;
    }
  return null;
}
async function G(e, l, i, n, a, t) {
  if (n && a) {
    const s = await n(a);
    if (s[l]) return s[l];
  }
  const r = e.find((s) => s.name === l);
  return r ? await J(i, r, t) : null;
}
async function $e(e, l, i, n) {
  let a = {};
  i && (a = await i(l));
  const t = e.map(async (r) => {
    if (a[r.name]) return;
    const s = await J(M(l, r.name), r, n);
    s && (a[r.name] = s);
  });
  return await Promise.all(t), a;
}
function Ie(e) {
  return e.reduce((l, i) => (l[i.name] = i.defaultValue !== void 0 ? i.defaultValue : i.type === "checkbox" ? [] : "", l), {});
}
const L = (e) => {
  let l;
  const i = /* @__PURE__ */ new Set(), n = (c, x) => {
    const f = typeof c == "function" ? c(l) : c;
    if (!Object.is(f, l)) {
      const V = l;
      l = x ?? (typeof f != "object" || f === null) ? f : Object.assign({}, l, f), i.forEach((F) => F(l, V));
    }
  }, a = () => l, s = { setState: n, getState: a, getInitialState: () => u, subscribe: (c) => (i.add(c), () => i.delete(c)) }, u = l = e(n, a, s);
  return s;
}, Fe = (e) => e ? L(e) : L;
function Re(e, l, i) {
  return Fe()((n, a) => ({
    values: Ie(e),
    errors: {},
    validatingFields: [],
    isSubmitting: !1,
    setFieldValue: async (t, r) => {
      const s = e.find((c) => c.name === t), u = s ? H(s, r) : r;
      n((c) => ({
        values: Se(c.values, t, u),
        validatingFields: [...c.validatingFields, t]
      }));
      try {
        const c = a().values, x = await G(e, t, u, l, c, i);
        n((f) => ({
          errors: { ...f.errors, [t]: x || "" },
          validatingFields: f.validatingFields.filter((V) => V !== t)
        }));
      } catch {
        n((x) => ({
          validatingFields: x.validatingFields.filter((f) => f !== t)
        }));
      }
    },
    setFieldBlur: async (t) => {
      n((r) => ({
        validatingFields: [...r.validatingFields, t]
      }));
      try {
        const r = a().values, s = M(r, t), u = await G(e, t, s, l, r, i);
        n((c) => ({
          errors: { ...c.errors, [t]: u || "" },
          validatingFields: c.validatingFields.filter((x) => x !== t)
        }));
      } catch {
        n((s) => ({
          validatingFields: s.validatingFields.filter((u) => u !== t)
        }));
      }
    },
    setSubmitting: (t) => n({ isSubmitting: t }),
    runSubmitValidation: async () => {
      n({ isSubmitting: !0 });
      const t = a(), r = await $e(e, t.values, l, i), s = Object.keys(r).length > 0;
      return n({
        errors: r,
        isSubmitting: !1
      }), {
        state: a(),
        hasError: s
      };
    }
  }));
}
function w(...e) {
  return le(ae(e));
}
const Ce = ["type", "value"], Q = /* @__PURE__ */ p({
  __name: "Input",
  props: {
    class: {},
    type: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: l }) {
    const i = e, n = l;
    return (a, t) => (d(), g("input", $(a.$attrs, {
      type: e.type,
      class: o(w)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", i.class),
      value: e.modelValue,
      onInput: t[0] || (t[0] = (r) => n("update:modelValue", r.target.value)),
      onBlur: t[1] || (t[1] = (r) => n("blur", r))
    }), null, 16, Ce));
  }
}), P = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = e, n = l, a = (t) => {
      n("update:modelValue", H(i.field, t));
    };
    return (t, r) => (d(), y(Q, {
      id: e.fieldId,
      type: e.field.type,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue ?? "",
      "onUpdate:modelValue": a,
      onBlur: r[0] || (r[0] = (s) => n("blur", s))
    }, null, 8, ["id", "type", "placeholder", "disabled", "name", "modelValue"]));
  }
}), qe = ["value"], Pe = /* @__PURE__ */ p({
  __name: "Textarea",
  props: {
    class: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: l }) {
    const i = e, n = l;
    return (a, t) => (d(), g("textarea", $(a.$attrs, {
      class: o(w)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", i.class),
      value: e.modelValue,
      onInput: t[0] || (t[0] = (r) => n("update:modelValue", r.target.value)),
      onBlur: t[1] || (t[1] = (r) => n("blur", r))
    }), null, 16, qe));
  }
}), De = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = l;
    return (n, a) => (d(), y(Pe, {
      id: e.fieldId,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue ?? "",
      "onUpdate:modelValue": a[0] || (a[0] = (t) => i("update:modelValue", t))
    }, null, 8, ["id", "placeholder", "disabled", "name", "modelValue"]));
  }
}), Ne = /* @__PURE__ */ p({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const l = e, i = h(() => {
      const { class: a, ...t } = l;
      return t;
    }), n = j(i);
    return (a, t) => (d(), y(o(ie), $(o(n), {
      class: o(w)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", l.class)
    }), {
      default: m(() => [
        q(a.$slots, "default"),
        b(o(ne), { "as-child": "" }, {
          default: m(() => [
            b(o(ke), { class: "h-4 w-4 opacity-50" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ee = /* @__PURE__ */ p({
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
    const l = e, i = h(() => {
      const { class: a, ...t } = l;
      return t;
    }), n = j(i);
    return (a, t) => (d(), y(o(se), null, {
      default: m(() => [
        b(o(re), $(o(n), {
          class: o(w)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", l.class)
        }), {
          default: m(() => [
            b(o(oe), {
              class: D(o(w)("p-1", e.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"))
            }, {
              default: m(() => [
                q(a.$slots, "default")
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
}), Ue = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, je = /* @__PURE__ */ p({
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
    const l = e, i = h(() => {
      const { class: a, ...t } = l;
      return t;
    }), n = j(i);
    return (a, t) => (d(), y(o(de), $(o(n), {
      class: o(w)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        l.class
      )
    }), {
      default: m(() => [
        O("span", Ue, [
          b(o(ue), null, {
            default: m(() => [
              b(o(W), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        b(o(ce), null, {
          default: m(() => [
            q(a.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ae = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const a = A(e, l);
    return (t, r) => (d(), y(o(me), X(Y(o(a))), {
      default: m(() => [
        q(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Me = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = l;
    return (n, a) => (d(), y(Ae, {
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": a[0] || (a[0] = (t) => i("update:modelValue", t))
    }, {
      default: m(() => [
        b(Ne, { id: e.fieldId }, {
          default: m(() => [
            b(o(fe), {
              placeholder: e.field.placeholder || "Select an option"
            }, null, 8, ["placeholder"])
          ]),
          _: 1
        }, 8, ["id"]),
        b(Ee, null, {
          default: m(() => [
            (d(!0), g(N, null, E(e.field.options, (t) => (d(), y(je, {
              key: t.value,
              value: String(t.value)
            }, {
              default: m(() => [
                U(I(t.label), 1)
              ]),
              _: 2
            }, 1032, ["value"]))), 128))
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["disabled", "name", "modelValue"]));
  }
}), Oe = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = e, n = l, a = h(() => {
      const { class: r, ...s } = i;
      return s;
    }), t = A(a, n);
    return (r, s) => (d(), y(o(be), $(o(t), {
      class: o(w)("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", i.class),
      onBlur: s[0] || (s[0] = (u) => n("blur"))
    }), {
      default: m(() => [
        b(o(pe), { class: "flex h-full w-full items-center justify-center text-current" }, {
          default: m(() => [
            b(o(W), { class: "h-4 w-4" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), T = /* @__PURE__ */ p({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const l = e, i = h(() => {
      const { class: n, ...a } = l;
      return a;
    });
    return (n, a) => (d(), y(o(ge), $(i.value, {
      class: o(w)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", l.class)
    }), {
      default: m(() => [
        q(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ze = { class: "flex flex-wrap gap-4" }, Te = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = e, n = l, a = (t, r) => {
      const s = Array.isArray(i.modelValue) ? [...i.modelValue] : [];
      if (r)
        s.push(t);
      else {
        const u = s.indexOf(t);
        u > -1 && s.splice(u, 1);
      }
      n("update:modelValue", s);
    };
    return (t, r) => (d(), g("div", ze, [
      (d(!0), g(N, null, E(e.field.options, (s) => (d(), g("div", {
        key: s.value,
        class: "flex items-center space-x-2"
      }, [
        b(Oe, {
          id: `checkbox-${e.field.name}-${s.value}`,
          disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
          checked: Array.isArray(e.modelValue) && e.modelValue.includes(s.value),
          "onUpdate:checked": (u) => a(s.value, !!u)
        }, null, 8, ["id", "disabled", "checked", "onUpdate:checked"]),
        b(T, {
          for: `checkbox-${e.field.name}-${s.value}`,
          class: "font-normal"
        }, {
          default: m(() => [
            U(I(s.label), 1)
          ]),
          _: 2
        }, 1032, ["for"])
      ]))), 128))
    ]));
  }
}), Ge = /* @__PURE__ */ p({
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
    const l = e, i = h(() => {
      const { class: a, ...t } = l;
      return t;
    }), n = j(i);
    return (a, t) => (d(), y(o(ye), $(o(n), {
      class: o(w)("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", l.class)
    }), {
      default: m(() => [
        b(o(ve), { class: "flex items-center justify-center" }, {
          default: m(() => [
            b(o(we), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Le = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = e, n = l, a = h(() => {
      const { class: r, ...s } = i;
      return s;
    }), t = A(a, n);
    return (r, s) => (d(), y(o(he), $(o(t), {
      class: o(w)("grid gap-2", i.class)
    }), {
      default: m(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ke = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = l;
    return (n, a) => (d(), y(Le, {
      class: "flex flex-wrap gap-4",
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": a[0] || (a[0] = (t) => i("update:modelValue", t))
    }, {
      default: m(() => [
        (d(!0), g(N, null, E(e.field.options, (t) => (d(), g("div", {
          key: t.value,
          class: "flex items-center space-x-2"
        }, [
          b(Ge, {
            id: `radio-${e.field.name}-${t.value}`,
            value: String(t.value)
          }, null, 8, ["id", "value"]),
          b(T, {
            for: `radio-${e.field.name}-${t.value}`,
            class: "font-normal"
          }, {
            default: m(() => [
              U(I(t.label), 1)
            ]),
            _: 2
          }, 1032, ["for"])
        ]))), 128))
      ]),
      _: 1
    }, 8, ["disabled", "name", "modelValue"]));
  }
}), We = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = l;
    return (n, a) => (d(), y(Q, {
      id: e.fieldId,
      type: "date",
      modelValue: e.modelValue,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "aria-invalid": e.ariaInvalid,
      "aria-required": e.ariaRequired,
      "aria-describedby": e.ariaDescribedby,
      "onUpdate:modelValue": a[0] || (a[0] = (t) => i("update:modelValue", t)),
      onBlur: a[1] || (a[1] = (t) => i("blur", t))
    }, null, 8, ["id", "modelValue", "placeholder", "disabled", "name", "aria-invalid", "aria-required", "aria-describedby"]));
  }
}), He = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = e, n = l, a = h(() => {
      const { class: r, ...s } = i;
      return s;
    }), t = A(a, n);
    return (r, s) => (d(), y(o(xe), $(o(t), {
      class: o(w)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        i.class
      )
    }), {
      default: m(() => [
        b(o(Ve), {
          class: D(o(w)(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          ))
        }, null, 8, ["class"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Je = { class: "flex items-center space-x-2" }, Qe = /* @__PURE__ */ p({
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
  setup(e, { emit: l }) {
    const i = l;
    return (n, a) => (d(), g("div", Je, [
      b(He, {
        id: e.fieldId,
        checked: e.modelValue,
        disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
        "aria-invalid": e.ariaInvalid,
        "aria-required": e.ariaRequired,
        "aria-describedby": e.ariaDescribedby,
        "onUpdate:checked": a[0] || (a[0] = (t) => i("update:modelValue", t))
      }, null, 8, ["id", "checked", "disabled", "aria-invalid", "aria-required", "aria-describedby"])
    ]));
  }
}), K = {
  text: P,
  number: P,
  password: P,
  email: P,
  textarea: De,
  select: Me,
  checkbox: Te,
  radio: Ke,
  date: We,
  switch: Qe
}, Xe = {
  key: 0,
  class: "text-destructive"
}, Ye = ["id"], Ze = ["id"], _e = /* @__PURE__ */ p({
  __name: "FormFieldRenderer",
  props: {
    field: {},
    modelValue: {},
    error: {},
    componentMap: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: l }) {
    const i = e, n = l, a = h(() => `field-${i.field.name}`), t = h(() => `${a.value}-description`), r = h(() => `${a.value}-error`), s = h(() => {
      var f;
      return (f = i.field.validations) == null ? void 0 : f.some((V) => V.type === "required");
    }), u = h(() => {
      const f = [];
      return i.field.description && f.push(t.value), i.error && f.push(r.value), f.length > 0 ? f.join(" ") : void 0;
    }), c = h(
      () => i.componentMap ? { ...K, ...i.componentMap } : K
    ), x = h(
      () => c.value[i.field.type] ?? P
    );
    return (f, V) => (d(), g("div", {
      class: D(["space-y-2", e.field.className])
    }, [
      e.field.label ? (d(), y(T, {
        key: 0,
        for: a.value,
        class: D(s.value ? "flex items-center gap-1" : "")
      }, {
        default: m(() => [
          U(I(e.field.label) + " ", 1),
          s.value ? (d(), g("span", Xe, "*")) : R("", !0)
        ]),
        _: 1
      }, 8, ["for", "class"])) : R("", !0),
      (d(), y(Z(x.value), {
        field: e.field,
        fieldId: a.value,
        modelValue: e.modelValue,
        "aria-invalid": !!e.error,
        "aria-required": s.value,
        "aria-describedby": u.value,
        "onUpdate:modelValue": V[0] || (V[0] = (F) => n("update:modelValue", F)),
        onBlur: V[1] || (V[1] = (F) => n("blur", F))
      }, null, 40, ["field", "fieldId", "modelValue", "aria-invalid", "aria-required", "aria-describedby"])),
      e.field.description ? (d(), g("p", {
        key: 1,
        id: t.value,
        class: "text-[0.8rem] text-muted-foreground"
      }, I(e.field.description), 9, Ye)) : R("", !0),
      e.error ? (d(), g("p", {
        key: 2,
        id: r.value,
        class: "text-[0.8rem] font-medium text-destructive"
      }, I(e.error), 9, Ze)) : R("", !0)
    ], 2));
  }
});
function et({ schema: e }) {
  const l = Re(e.fields, e.resolver, e.errorMessages), i = _(l.getState()), n = l.subscribe((u) => {
    i.value = u;
  });
  return ee(() => {
    n();
  }), {
    store: l,
    state: i,
    // This is a Ref
    setValue: async (u, c) => {
      await l.getState().setFieldValue(u, c);
    },
    getValue: (u) => M(i.value.values, u),
    validate: async () => {
      const { hasError: u, state: c } = await l.getState().runSubmitValidation();
      return { hasError: u, values: c.values };
    },
    reset: () => {
      l.setState({
        values: {},
        errors: {},
        isSubmitting: !1
      });
    }
  };
}
const tt = {
  key: 0,
  class: "space-y-1"
}, at = {
  key: 0,
  class: "text-2xl font-bold tracking-tight"
}, lt = {
  key: 1,
  class: "text-muted-foreground"
}, it = { class: "space-y-4" }, nt = ["disabled"], ct = /* @__PURE__ */ p({
  __name: "DynamicForm",
  props: {
    schema: {},
    className: {},
    form: {}
  },
  emits: ["submit"],
  setup(e, { emit: l }) {
    const i = e, n = l, a = et({ schema: i.schema }), t = i.form || a, { store: r, state: s } = t, u = async (v, C) => {
      await r.getState().setFieldValue(v, C);
    }, c = async (v) => {
      await r.getState().setFieldBlur(v);
    }, x = (v) => typeof v.hidden == "function" ? v.hidden(s.value.values) : !!v.hidden, f = (v) => {
      const C = typeof v.disabled == "function" ? v.disabled(s.value.values) : !!v.disabled, k = s.value.validatingFields.includes(v.name);
      return { ...v, disabled: C || k };
    }, V = async () => {
      const { hasError: v, values: C } = await t.validate();
      if (v) {
        const k = i.schema.fields.find((B) => s.value.errors[B.name]);
        if (k) {
          const B = document.getElementById(`field-${k.name}`);
          B == null || B.focus(), B == null || B.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      n("submit", C);
    }, F = h(() => s.value.validatingFields.length > 0);
    return (v, C) => (d(), g("form", {
      class: D(["space-y-6", e.className]),
      onSubmit: te(V, ["prevent"])
    }, [
      e.schema.title || e.schema.description ? (d(), g("div", tt, [
        e.schema.title ? (d(), g("h2", at, I(e.schema.title), 1)) : R("", !0),
        e.schema.description ? (d(), g("p", lt, I(e.schema.description), 1)) : R("", !0)
      ])) : R("", !0),
      O("div", it, [
        (d(!0), g(N, null, E(e.schema.fields, (k) => (d(), g(N, {
          key: k.id
        }, [
          x(k) ? R("", !0) : (d(), y(_e, {
            key: 0,
            field: f(k),
            "model-value": o(M)(o(s).values, k.name),
            error: o(s).errors[k.name],
            "onUpdate:modelValue": (B) => u(k.name, B),
            onBlur: (B) => c(k.name)
          }, null, 8, ["field", "model-value", "error", "onUpdate:modelValue", "onBlur"]))
        ], 64))), 128))
      ]),
      O("button", {
        type: "submit",
        disabled: o(s).isSubmitting || F.value,
        class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      }, I(o(s).isSubmitting ? "Submitting..." : F.value ? "Validating..." : e.schema.submitButtonText || "Submit"), 9, nt)
    ], 34));
  }
});
export {
  ct as DynamicForm,
  _e as FormFieldRenderer,
  K as defaultComponentMap,
  et as useForm
};
