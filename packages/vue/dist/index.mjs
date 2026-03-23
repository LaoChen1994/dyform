import { defineComponent as y, openBlock as d, createElementBlock as h, mergeProps as I, unref as o, createBlock as x, computed as V, withCtx as c, renderSlot as q, createVNode as g, normalizeClass as D, createElementVNode as z, normalizeProps as Y, guardReactiveProps as Z, Fragment as N, renderList as E, createTextVNode as U, toDisplayString as R, createCommentVNode as C, resolveDynamicComponent as _, ref as ee, onUnmounted as te, withModifiers as ae } from "vue";
import { clsx as le } from "clsx";
import { twMerge as ie } from "tailwind-merge";
import { useForwardProps as j, SelectTrigger as se, SelectIcon as ne, SelectPortal as re, SelectContent as oe, SelectViewport as de, SelectItem as ue, SelectItemIndicator as ce, SelectItemText as me, useForwardPropsEmits as A, SelectRoot as fe, SelectValue as be, CheckboxRoot as pe, CheckboxIndicator as ge, Label as ye, RadioGroupItem as ve, RadioGroupIndicator as he, RadioGroupRoot as xe, SwitchRoot as Ve, SwitchThumb as ke } from "radix-vue";
import { ChevronDown as we, Check as K, Circle as Be } from "lucide-vue-next";
function O(e) {
  if (typeof e == "number") return Number.isNaN(e) ? null : e;
  if (typeof e != "string" || e.trim() === "") return null;
  const l = Number(e);
  return Number.isNaN(l) ? null : l;
}
var Se = {
  required: "{label} is required",
  min: "{label} must be at least {value}",
  max: "{label} must be at most {value}",
  email: "Invalid email address",
  pattern: "Invalid format",
  custom: "Invalid value"
};
function $(e, l, i) {
  return e ? e.replace("{label}", l.label).replace("{value}", String(i.value || "")) : "";
}
function M(e, l, i) {
  if (!l) return i;
  const s = l.split(/[.[\]]/).filter(Boolean);
  let t = e;
  for (const a of s) {
    if (t == null) return i;
    t = t[a];
  }
  return t === void 0 ? i : t;
}
function $e(e, l, i) {
  if (Object(e) !== e) return e;
  const s = l.split(/[.[\]]/).filter(Boolean), t = { ...e };
  let a = t;
  for (let r = 0; r < s.length - 1; r++) {
    const n = s[r], u = s[r + 1], w = /^\d+$/.test(u);
    !(n in a) || a[n] === null || typeof a[n] != "object" ? a[n] = w ? [] : {} : a[n] = Array.isArray(a[n]) ? [...a[n]] : { ...a[n] }, a = a[n];
  }
  return a[s[s.length - 1]] = i, t;
}
function W(e, l) {
  if (e.type !== "number") return l;
  if (l === "" || l === void 0 || l === null) return "";
  const i = O(l);
  return i === null ? l : i;
}
async function J(e, l, i) {
  if (!l.validations) return null;
  const s = { ...Se, ...i };
  for (const t of l.validations)
    switch (t.type) {
      case "required":
        if (e == null || e === "" || Array.isArray(e) && e.length === 0)
          return t.message || $(s.required, l, t);
        break;
      case "min":
        if (l.type === "number") {
          const a = O(e);
          if (a !== null && a < t.value) {
            const r = l.type === "number" ? s.min : typeof e == "string" ? "{label} must be at least {value} characters" : s.min;
            return t.message || $(r, l, t);
          }
          break;
        }
        if (typeof e == "number" && e < t.value)
          return t.message || $(s.min, l, t);
        if (typeof e == "string" && e.length < t.value)
          return t.message || $("{label} must be at least {value} characters", l, t);
        break;
      case "max":
        if (l.type === "number") {
          const a = O(e);
          if (a !== null && a > t.value)
            return t.message || $(s.max, l, t);
          break;
        }
        if (typeof e == "number" && e > t.value)
          return t.message || $(s.max, l, t);
        if (typeof e == "string" && e.length > t.value)
          return t.message || $("{label} must be at most {value} characters", l, t);
        break;
      case "email": {
        if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
          return t.message || $(s.email, l, t);
        break;
      }
      case "pattern":
        if (e && t.value && !new RegExp(t.value).test(e))
          return t.message || $(s.pattern, l, t);
        break;
      case "custom":
        if (t.validator) {
          const a = await t.validator(e);
          if (typeof a == "string") return a;
          if (a === !1) return t.message || $(s.custom, l, t);
        }
        break;
    }
  return null;
}
async function L(e, l, i, s, t, a) {
  if (s && t) {
    const n = await s(t);
    if (n[l]) return n[l];
  }
  const r = e.find((n) => n.name === l);
  return r ? await J(i, r, a) : null;
}
async function Ie(e, l, i, s) {
  let t = {};
  i && (t = await i(l));
  const a = e.map(async (r) => {
    if (t[r.name] || (typeof r.hidden == "function" ? r.hidden(l) : r.hidden)) return;
    const u = await J(M(l, r.name), r, s);
    u && (t[r.name] = u);
  });
  return await Promise.all(a), t;
}
function Fe(e) {
  return e.reduce((l, i) => (l[i.name] = i.defaultValue !== void 0 ? i.defaultValue : i.type === "checkbox" ? [] : "", l), {});
}
function Re(e) {
  let l = e;
  const i = /* @__PURE__ */ new Set();
  return { getState: () => l, setState: (r) => {
    const n = typeof r == "function" ? r(l) : r;
    if (!Object.is(n, l)) {
      const u = l;
      l = { ...l, ...n }, i.forEach((w) => w(l, u));
    }
  }, subscribe: (r) => (i.add(r), () => i.delete(r)) };
}
function Ce(e, l, i) {
  const s = Re({
    values: Fe(e),
    errors: {},
    validatingFields: [],
    isSubmitting: !1
  }), { getState: t, setState: a } = s;
  return {
    store: s,
    setFieldValue: async (m, f) => {
      const v = e.find((b) => b.name === m), S = v ? W(v, f) : f;
      a((b) => ({
        values: $e(b.values, m, S)
      }));
      const p = !!t().errors[m];
      if (v && ["select", "checkbox", "radio", "switch", "date"].includes(v.type) || p) {
        a((b) => ({
          validatingFields: [...b.validatingFields, m]
        }));
        try {
          const b = t().values, k = await L(e, m, S, l, b, i);
          a((G) => ({
            errors: { ...G.errors, [m]: k || "" },
            validatingFields: G.validatingFields.filter((X) => X !== m)
          }));
        } catch {
          a((b) => ({
            validatingFields: b.validatingFields.filter((k) => k !== m)
          }));
        }
      }
    },
    setFieldBlur: async (m) => {
      a((f) => ({
        validatingFields: [...f.validatingFields, m]
      }));
      try {
        const f = t().values, v = M(f, m), S = await L(e, m, v, l, f, i);
        a((p) => ({
          errors: { ...p.errors, [m]: S || "" },
          validatingFields: p.validatingFields.filter((F) => F !== m)
        }));
      } catch {
        a((f) => ({
          validatingFields: f.validatingFields.filter((v) => v !== m)
        }));
      }
    },
    setSubmitting: (m) => a({ isSubmitting: m }),
    runSubmitValidation: async () => {
      a({ isSubmitting: !0 });
      const m = t().values, f = await Ie(e, m, l, i), v = Object.keys(f).length > 0;
      return a({
        errors: f,
        isSubmitting: !1
      }), {
        state: t(),
        hasError: v
      };
    }
  };
}
function B(...e) {
  return ie(le(e));
}
const qe = ["type", "value"], Q = /* @__PURE__ */ y({
  __name: "Input",
  props: {
    class: {},
    type: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: l }) {
    const i = e, s = l;
    return (t, a) => (d(), h("input", I(t.$attrs, {
      type: e.type,
      class: o(B)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", i.class),
      value: e.modelValue,
      onInput: a[0] || (a[0] = (r) => s("update:modelValue", r.target.value)),
      onBlur: a[1] || (a[1] = (r) => s("blur", r))
    }), null, 16, qe));
  }
}), P = /* @__PURE__ */ y({
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
    const i = e, s = l, t = (a) => {
      s("update:modelValue", W(i.field, a));
    };
    return (a, r) => (d(), x(Q, {
      id: e.fieldId,
      type: e.field.type,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue ?? "",
      "onUpdate:modelValue": t,
      onBlur: r[0] || (r[0] = (n) => s("blur", n))
    }, null, 8, ["id", "type", "placeholder", "disabled", "name", "modelValue"]));
  }
}), Pe = ["value"], De = /* @__PURE__ */ y({
  __name: "Textarea",
  props: {
    class: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: l }) {
    const i = e, s = l;
    return (t, a) => (d(), h("textarea", I(t.$attrs, {
      class: o(B)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", i.class),
      value: e.modelValue,
      onInput: a[0] || (a[0] = (r) => s("update:modelValue", r.target.value)),
      onBlur: a[1] || (a[1] = (r) => s("blur", r))
    }), null, 16, Pe));
  }
}), Ne = /* @__PURE__ */ y({
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
    return (s, t) => (d(), x(De, {
      id: e.fieldId,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue ?? "",
      "onUpdate:modelValue": t[0] || (t[0] = (a) => i("update:modelValue", a))
    }, null, 8, ["id", "placeholder", "disabled", "name", "modelValue"]));
  }
}), Ee = /* @__PURE__ */ y({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const l = e, i = V(() => {
      const { class: t, ...a } = l;
      return a;
    }), s = j(i);
    return (t, a) => (d(), x(o(se), I(o(s), {
      class: o(B)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", l.class)
    }), {
      default: c(() => [
        q(t.$slots, "default"),
        g(o(ne), { "as-child": "" }, {
          default: c(() => [
            g(o(we), { class: "h-4 w-4 opacity-50" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ue = /* @__PURE__ */ y({
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
    const l = e, i = V(() => {
      const { class: t, ...a } = l;
      return a;
    }), s = j(i);
    return (t, a) => (d(), x(o(re), null, {
      default: c(() => [
        g(o(oe), I(o(s), {
          class: o(B)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", l.class)
        }), {
          default: c(() => [
            g(o(de), {
              class: D(o(B)("p-1", e.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"))
            }, {
              default: c(() => [
                q(t.$slots, "default")
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
}), je = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, Ae = /* @__PURE__ */ y({
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
    const l = e, i = V(() => {
      const { class: t, ...a } = l;
      return a;
    }), s = j(i);
    return (t, a) => (d(), x(o(ue), I(o(s), {
      class: o(B)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        l.class
      )
    }), {
      default: c(() => [
        z("span", je, [
          g(o(ce), null, {
            default: c(() => [
              g(o(K), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        g(o(me), null, {
          default: c(() => [
            q(t.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Me = /* @__PURE__ */ y({
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
    const t = A(e, l);
    return (a, r) => (d(), x(o(fe), Y(Z(o(t))), {
      default: c(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ze = /* @__PURE__ */ y({
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
    return (s, t) => (d(), x(Me, {
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": t[0] || (t[0] = (a) => i("update:modelValue", a))
    }, {
      default: c(() => [
        g(Ee, { id: e.fieldId }, {
          default: c(() => [
            g(o(be), {
              placeholder: e.field.placeholder || "Select an option"
            }, null, 8, ["placeholder"])
          ]),
          _: 1
        }, 8, ["id"]),
        g(Ue, null, {
          default: c(() => [
            (d(!0), h(N, null, E(e.field.options, (a) => (d(), x(Ae, {
              key: a.value,
              value: String(a.value)
            }, {
              default: c(() => [
                U(R(a.label), 1)
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
}), Oe = /* @__PURE__ */ y({
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
    const i = e, s = l, t = V(() => {
      const { class: r, ...n } = i;
      return n;
    }), a = A(t, s);
    return (r, n) => (d(), x(o(pe), I(o(a), {
      class: o(B)("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", i.class),
      onBlur: n[0] || (n[0] = (u) => s("blur"))
    }), {
      default: c(() => [
        g(o(ge), { class: "flex h-full w-full items-center justify-center text-current" }, {
          default: c(() => [
            g(o(K), { class: "h-4 w-4" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), T = /* @__PURE__ */ y({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const l = e, i = V(() => {
      const { class: s, ...t } = l;
      return t;
    });
    return (s, t) => (d(), x(o(ye), I(i.value, {
      class: o(B)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", l.class)
    }), {
      default: c(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Te = { class: "flex flex-wrap gap-4" }, Ge = /* @__PURE__ */ y({
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
    const i = e, s = l, t = (a, r) => {
      const n = Array.isArray(i.modelValue) ? [...i.modelValue] : [];
      if (r)
        n.push(a);
      else {
        const u = n.indexOf(a);
        u > -1 && n.splice(u, 1);
      }
      s("update:modelValue", n);
    };
    return (a, r) => (d(), h("div", Te, [
      (d(!0), h(N, null, E(e.field.options, (n) => (d(), h("div", {
        key: n.value,
        class: "flex items-center space-x-2"
      }, [
        g(Oe, {
          id: `checkbox-${e.field.name}-${n.value}`,
          disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
          checked: Array.isArray(e.modelValue) && e.modelValue.includes(n.value),
          "onUpdate:checked": (u) => t(n.value, !!u)
        }, null, 8, ["id", "disabled", "checked", "onUpdate:checked"]),
        g(T, {
          for: `checkbox-${e.field.name}-${n.value}`,
          class: "font-normal"
        }, {
          default: c(() => [
            U(R(n.label), 1)
          ]),
          _: 2
        }, 1032, ["for"])
      ]))), 128))
    ]));
  }
}), Le = /* @__PURE__ */ y({
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
    const l = e, i = V(() => {
      const { class: t, ...a } = l;
      return a;
    }), s = j(i);
    return (t, a) => (d(), x(o(ve), I(o(s), {
      class: o(B)("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", l.class)
    }), {
      default: c(() => [
        g(o(he), { class: "flex items-center justify-center" }, {
          default: c(() => [
            g(o(Be), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), He = /* @__PURE__ */ y({
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
    const i = e, s = l, t = V(() => {
      const { class: r, ...n } = i;
      return n;
    }), a = A(t, s);
    return (r, n) => (d(), x(o(xe), I(o(a), {
      class: o(B)("grid gap-2", i.class)
    }), {
      default: c(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ke = /* @__PURE__ */ y({
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
    return (s, t) => (d(), x(He, {
      class: "flex flex-wrap gap-4",
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      modelValue: e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": t[0] || (t[0] = (a) => i("update:modelValue", a))
    }, {
      default: c(() => [
        (d(!0), h(N, null, E(e.field.options, (a) => (d(), h("div", {
          key: a.value,
          class: "flex items-center space-x-2"
        }, [
          g(Le, {
            id: `radio-${e.field.name}-${a.value}`,
            value: String(a.value)
          }, null, 8, ["id", "value"]),
          g(T, {
            for: `radio-${e.field.name}-${a.value}`,
            class: "font-normal"
          }, {
            default: c(() => [
              U(R(a.label), 1)
            ]),
            _: 2
          }, 1032, ["for"])
        ]))), 128))
      ]),
      _: 1
    }, 8, ["disabled", "name", "modelValue"]));
  }
}), We = /* @__PURE__ */ y({
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
    return (s, t) => (d(), x(Q, {
      id: e.fieldId,
      type: "date",
      modelValue: e.modelValue,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "aria-invalid": e.ariaInvalid,
      "aria-required": e.ariaRequired,
      "aria-describedby": e.ariaDescribedby,
      "onUpdate:modelValue": t[0] || (t[0] = (a) => i("update:modelValue", a)),
      onBlur: t[1] || (t[1] = (a) => i("blur", a))
    }, null, 8, ["id", "modelValue", "placeholder", "disabled", "name", "aria-invalid", "aria-required", "aria-describedby"]));
  }
}), Je = /* @__PURE__ */ y({
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
    const i = e, s = l, t = V(() => {
      const { class: r, ...n } = i;
      return n;
    }), a = A(t, s);
    return (r, n) => (d(), x(o(Ve), I(o(a), {
      class: o(B)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        i.class
      )
    }), {
      default: c(() => [
        g(o(ke), {
          class: D(o(B)(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          ))
        }, null, 8, ["class"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Qe = { class: "flex items-center space-x-2" }, Xe = /* @__PURE__ */ y({
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
    return (s, t) => (d(), h("div", Qe, [
      g(Je, {
        id: e.fieldId,
        checked: e.modelValue,
        disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
        "aria-invalid": e.ariaInvalid,
        "aria-required": e.ariaRequired,
        "aria-describedby": e.ariaDescribedby,
        "onUpdate:checked": t[0] || (t[0] = (a) => i("update:modelValue", a))
      }, null, 8, ["id", "checked", "disabled", "aria-invalid", "aria-required", "aria-describedby"])
    ]));
  }
}), H = {
  text: P,
  number: P,
  password: P,
  email: P,
  textarea: Ne,
  select: ze,
  checkbox: Ge,
  radio: Ke,
  date: We,
  switch: Xe
}, Ye = {
  key: 0,
  class: "text-destructive"
}, Ze = ["id"], _e = ["id"], et = /* @__PURE__ */ y({
  __name: "FormFieldRenderer",
  props: {
    field: {},
    modelValue: {},
    error: {},
    componentMap: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: l }) {
    const i = e, s = l, t = V(() => `field-${i.field.name}`), a = V(() => `${t.value}-description`), r = V(() => `${t.value}-error`), n = V(() => {
      var f;
      return (f = i.field.validations) == null ? void 0 : f.some((v) => v.type === "required");
    }), u = V(() => {
      const f = [];
      return i.field.description && f.push(a.value), i.error && f.push(r.value), f.length > 0 ? f.join(" ") : void 0;
    }), w = V(
      () => i.componentMap ? { ...H, ...i.componentMap } : H
    ), m = V(
      () => w.value[i.field.type] ?? P
    );
    return (f, v) => (d(), h("div", {
      class: D(["space-y-2", e.field.className])
    }, [
      e.field.label ? (d(), x(T, {
        key: 0,
        for: t.value,
        class: D(n.value ? "flex items-center gap-1" : "")
      }, {
        default: c(() => [
          U(R(e.field.label) + " ", 1),
          n.value ? (d(), h("span", Ye, "*")) : C("", !0)
        ]),
        _: 1
      }, 8, ["for", "class"])) : C("", !0),
      (d(), x(_(m.value), {
        field: e.field,
        fieldId: t.value,
        modelValue: e.modelValue,
        "aria-invalid": !!e.error,
        "aria-required": n.value,
        "aria-describedby": u.value,
        "onUpdate:modelValue": v[0] || (v[0] = (S) => s("update:modelValue", S)),
        onBlur: v[1] || (v[1] = (S) => s("blur", S))
      }, null, 40, ["field", "fieldId", "modelValue", "aria-invalid", "aria-required", "aria-describedby"])),
      e.field.description ? (d(), h("p", {
        key: 1,
        id: a.value,
        class: "text-[0.8rem] text-muted-foreground"
      }, R(e.field.description), 9, Ze)) : C("", !0),
      e.error ? (d(), h("p", {
        key: 2,
        id: r.value,
        class: "text-[0.8rem] font-medium text-destructive"
      }, R(e.error), 9, _e)) : C("", !0)
    ], 2));
  }
});
function tt({ schema: e }) {
  const l = Ce(e.fields, e.resolver, e.errorMessages), i = ee(l.store.getState()), s = l.store.subscribe((u) => {
    i.value = u;
  });
  return te(() => {
    s();
  }), {
    engine: l,
    state: i,
    // This is a Ref
    setValue: async (u, w) => {
      await l.setFieldValue(u, w);
    },
    getValue: (u) => M(i.value.values, u),
    validate: async () => {
      const { hasError: u, state: w } = await l.runSubmitValidation();
      return { hasError: u, values: w.values };
    },
    reset: () => {
      l.store.setState({
        values: {},
        errors: {},
        isSubmitting: !1
      });
    }
  };
}
const at = {
  key: 0,
  class: "space-y-1"
}, lt = {
  key: 0,
  class: "text-2xl font-bold tracking-tight"
}, it = {
  key: 1,
  class: "text-muted-foreground"
}, st = { class: "space-y-4" }, nt = ["disabled"], mt = /* @__PURE__ */ y({
  __name: "DynamicForm",
  props: {
    schema: {},
    className: {},
    form: {}
  },
  emits: ["submit"],
  setup(e, { emit: l }) {
    const i = e, s = l, t = tt({ schema: i.schema }), a = i.form || t, { engine: r, state: n } = a, u = async (p, F) => {
      await r.setFieldValue(p, F);
    }, w = async (p) => {
      await r.setFieldBlur(p);
    }, m = (p) => typeof p.hidden == "function" ? p.hidden(n.value.values) : !!p.hidden, f = (p) => {
      const F = typeof p.disabled == "function" ? p.disabled(n.value.values) : !!p.disabled, b = n.value.validatingFields.includes(p.name);
      return { ...p, disabled: F || b };
    }, v = async () => {
      const { hasError: p, values: F } = await a.validate();
      if (p) {
        const b = i.schema.fields.find((k) => n.value.errors[k.name]);
        if (b) {
          const k = document.getElementById(`field-${b.name}`);
          k == null || k.focus(), k == null || k.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      await s("submit", F);
    }, S = V(() => n.value.validatingFields.length > 0);
    return (p, F) => (d(), h("form", {
      class: D(["space-y-6", e.className]),
      onSubmit: ae(v, ["prevent"])
    }, [
      e.schema.title || e.schema.description ? (d(), h("div", at, [
        e.schema.title ? (d(), h("h2", lt, R(e.schema.title), 1)) : C("", !0),
        e.schema.description ? (d(), h("p", it, R(e.schema.description), 1)) : C("", !0)
      ])) : C("", !0),
      z("div", st, [
        (d(!0), h(N, null, E(e.schema.fields, (b) => (d(), h(N, {
          key: b.id
        }, [
          m(b) ? C("", !0) : (d(), x(et, {
            key: 0,
            field: f(b),
            "model-value": o(M)(o(n).values, b.name),
            error: o(n).errors[b.name],
            "onUpdate:modelValue": (k) => u(b.name, k),
            onBlur: (k) => w(b.name)
          }, null, 8, ["field", "model-value", "error", "onUpdate:modelValue", "onBlur"]))
        ], 64))), 128))
      ]),
      z("button", {
        type: "submit",
        disabled: o(n).isSubmitting || S.value,
        class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      }, R(o(n).isSubmitting ? "Submitting..." : S.value ? "Validating..." : e.schema.submitButtonText || "Submit"), 9, nt)
    ], 34));
  }
});
export {
  mt as DynamicForm,
  et as FormFieldRenderer,
  H as defaultComponentMap,
  tt as useForm
};
