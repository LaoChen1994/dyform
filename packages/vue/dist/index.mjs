import { defineComponent as g, openBlock as d, createElementBlock as m, mergeProps as P, unref as i, createBlock as x, computed as k, withCtx as p, renderSlot as U, createVNode as b, normalizeClass as q, createElementVNode as F, normalizeProps as X, guardReactiveProps as Y, Fragment as T, renderList as M, createTextVNode as z, toDisplayString as S, createCommentVNode as $, resolveDynamicComponent as Z, resolveComponent as _, normalizeStyle as ee, ref as te, onUnmounted as ae, withModifiers as le } from "vue";
import { normalizeFieldValue as se, get as H, createFormEngine as oe, flattenElements as de } from "pdyform-core";
import { clsx as ie } from "clsx";
import { twMerge as re } from "tailwind-merge";
import { useForwardProps as G, SelectTrigger as ne, SelectIcon as ue, SelectPortal as ce, SelectContent as me, SelectViewport as fe, SelectItem as pe, SelectItemIndicator as be, SelectItemText as ye, useForwardPropsEmits as A, SelectRoot as ge, SelectValue as ve, CheckboxRoot as he, CheckboxIndicator as xe, Label as Ve, RadioGroupItem as ke, RadioGroupIndicator as Be, RadioGroupRoot as we, SwitchRoot as $e, SwitchThumb as Se } from "radix-vue";
import { ChevronDown as Ie, Check as K, Circle as Ce } from "lucide-vue-next";
function C(...e) {
  return re(ie(e));
}
const Re = ["type", "value"], J = /* @__PURE__ */ g({
  __name: "Input",
  props: {
    class: {},
    type: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: s }) {
    const a = e, o = s;
    return (l, t) => (d(), m("input", P(l.$attrs, {
      type: e.type,
      class: i(C)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", a.class),
      value: e.modelValue,
      onInput: t[0] || (t[0] = (c) => o("update:modelValue", c.target.value)),
      onBlur: t[1] || (t[1] = (c) => o("blur", c))
    }), null, 16, Re));
  }
}), j = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = e, o = s, l = (t) => {
      o("update:modelValue", se(a.field, t));
    };
    return (t, c) => (d(), x(J, {
      id: e.fieldId,
      type: e.field.type,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue ?? "",
      "onUpdate:modelValue": l,
      onBlur: c[0] || (c[0] = (n) => o("blur", n))
    }, null, 8, ["id", "type", "placeholder", "disabled", "name", "model-value"]));
  }
}), Fe = ["value"], Pe = /* @__PURE__ */ g({
  __name: "Textarea",
  props: {
    class: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: s }) {
    const a = e, o = s;
    return (l, t) => (d(), m("textarea", P(l.$attrs, {
      class: i(C)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", a.class),
      value: e.modelValue,
      onInput: t[0] || (t[0] = (c) => o("update:modelValue", c.target.value)),
      onBlur: t[1] || (t[1] = (c) => o("blur", c))
    }), null, 16, Fe));
  }
}), qe = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = s;
    return (o, l) => (d(), x(Pe, {
      id: e.fieldId,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue ?? "",
      "onUpdate:modelValue": l[0] || (l[0] = (t) => a("update:modelValue", t))
    }, null, 8, ["id", "placeholder", "disabled", "name", "model-value"]));
  }
}), De = /* @__PURE__ */ g({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const s = e, a = k(() => {
      const { class: l, ...t } = s;
      return t;
    }), o = G(a);
    return (l, t) => (d(), x(i(ne), P(i(o), {
      class: i(C)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", s.class)
    }), {
      default: p(() => [
        U(l.$slots, "default"),
        b(i(ue), { "as-child": "" }, {
          default: p(() => [
            b(i(Ie), { class: "h-4 w-4 opacity-50" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ee = /* @__PURE__ */ g({
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
    const s = e, a = k(() => {
      const { class: l, ...t } = s;
      return t;
    }), o = G(a);
    return (l, t) => (d(), x(i(ce), null, {
      default: p(() => [
        b(i(me), P(i(o), {
          class: i(C)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", s.class)
        }), {
          default: p(() => [
            b(i(fe), {
              class: q(i(C)("p-1", e.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"))
            }, {
              default: p(() => [
                U(l.$slots, "default")
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
}), Le = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, Te = /* @__PURE__ */ g({
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
    const s = e, a = k(() => {
      const { class: l, ...t } = s;
      return t;
    }), o = G(a);
    return (l, t) => (d(), x(i(pe), P(i(o), {
      class: i(C)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        s.class
      )
    }), {
      default: p(() => [
        F("span", Le, [
          b(i(be), null, {
            default: p(() => [
              b(i(K), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        b(i(ye), null, {
          default: p(() => [
            U(l.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ue = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const l = A(e, s);
    return (t, c) => (d(), x(i(ge), X(Y(i(l))), {
      default: p(() => [
        U(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), je = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = s;
    return (o, l) => (d(), x(Ue, {
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": l[0] || (l[0] = (t) => a("update:modelValue", t))
    }, {
      default: p(() => [
        b(De, { id: e.fieldId }, {
          default: p(() => [
            b(i(ve), {
              placeholder: e.field.placeholder || "Select an option"
            }, null, 8, ["placeholder"])
          ]),
          _: 1
        }, 8, ["id"]),
        b(Ee, null, {
          default: p(() => [
            (d(!0), m(T, null, M(e.field.options, (t) => (d(), x(Te, {
              key: t.value,
              value: String(t.value)
            }, {
              default: p(() => [
                z(S(t.label), 1)
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
}), Me = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = e, o = s, l = k(() => {
      const { class: c, ...n } = a;
      return n;
    }), t = A(l, o);
    return (c, n) => (d(), x(i(he), P(i(t), {
      class: i(C)("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", a.class),
      onBlur: n[0] || (n[0] = (I) => o("blur"))
    }), {
      default: p(() => [
        b(i(xe), { class: "flex h-full w-full items-center justify-center text-current" }, {
          default: p(() => [
            b(i(K), { class: "h-4 w-4" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), O = /* @__PURE__ */ g({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const s = e, a = k(() => {
      const { class: o, ...l } = s;
      return l;
    });
    return (o, l) => (d(), x(i(Ve), P(a.value, {
      class: i(C)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", s.class)
    }), {
      default: p(() => [
        U(o.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ne = { class: "flex flex-wrap gap-4" }, ze = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = e, o = s, l = (t, c) => {
      const n = Array.isArray(a.modelValue) ? [...a.modelValue] : [];
      if (c)
        n.push(t);
      else {
        const I = n.indexOf(t);
        I > -1 && n.splice(I, 1);
      }
      o("update:modelValue", n);
    };
    return (t, c) => (d(), m("div", Ne, [
      (d(!0), m(T, null, M(e.field.options, (n) => (d(), m("div", {
        key: n.value,
        class: "flex items-center space-x-2"
      }, [
        b(Me, {
          id: `checkbox-${e.field.name}-${n.value}`,
          disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
          checked: Array.isArray(e.modelValue) && e.modelValue.includes(n.value),
          "onUpdate:checked": (I) => l(n.value, !!I)
        }, null, 8, ["id", "disabled", "checked", "onUpdate:checked"]),
        b(O, {
          for: `checkbox-${e.field.name}-${n.value}`,
          class: "font-normal"
        }, {
          default: p(() => [
            z(S(n.label), 1)
          ]),
          _: 2
        }, 1032, ["for"])
      ]))), 128))
    ]));
  }
}), Ge = /* @__PURE__ */ g({
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
    const s = e, a = k(() => {
      const { class: l, ...t } = s;
      return t;
    }), o = G(a);
    return (l, t) => (d(), x(i(ke), P(i(o), {
      class: i(C)("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", s.class)
    }), {
      default: p(() => [
        b(i(Be), { class: "flex items-center justify-center" }, {
          default: p(() => [
            b(i(Ce), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Ae = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = e, o = s, l = k(() => {
      const { class: c, ...n } = a;
      return n;
    }), t = A(l, o);
    return (c, n) => (d(), x(i(we), P(i(t), {
      class: i(C)("grid gap-2", a.class)
    }), {
      default: p(() => [
        U(c.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Oe = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = s;
    return (o, l) => (d(), x(Ae, {
      class: "flex flex-wrap gap-4",
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": l[0] || (l[0] = (t) => a("update:modelValue", t))
    }, {
      default: p(() => [
        (d(!0), m(T, null, M(e.field.options, (t) => (d(), m("div", {
          key: t.value,
          class: "flex items-center space-x-2"
        }, [
          b(Ge, {
            id: `radio-${e.field.name}-${t.value}`,
            value: String(t.value)
          }, null, 8, ["id", "value"]),
          b(O, {
            for: `radio-${e.field.name}-${t.value}`,
            class: "font-normal"
          }, {
            default: p(() => [
              z(S(t.label), 1)
            ]),
            _: 2
          }, 1032, ["for"])
        ]))), 128))
      ]),
      _: 1
    }, 8, ["disabled", "name", "model-value"]));
  }
}), We = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = s;
    return (o, l) => (d(), x(J, {
      id: e.fieldId,
      type: "date",
      "model-value": e.modelValue,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "aria-invalid": e.ariaInvalid,
      "aria-required": e.ariaRequired,
      "aria-describedby": e.ariaDescribedby,
      "onUpdate:modelValue": l[0] || (l[0] = (t) => a("update:modelValue", t)),
      onBlur: l[1] || (l[1] = (t) => a("blur", t))
    }, null, 8, ["id", "model-value", "placeholder", "disabled", "name", "aria-invalid", "aria-required", "aria-describedby"]));
  }
}), He = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = e, o = s, l = k(() => {
      const { class: c, ...n } = a;
      return n;
    }), t = A(l, o);
    return (c, n) => (d(), x(i($e), P(i(t), {
      class: i(C)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        a.class
      )
    }), {
      default: p(() => [
        b(i(Se), {
          class: q(i(C)(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          ))
        }, null, 8, ["class"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Ke = { class: "flex items-center space-x-2" }, Je = /* @__PURE__ */ g({
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
  setup(e, { emit: s }) {
    const a = s;
    return (o, l) => (d(), m("div", Ke, [
      b(He, {
        id: e.fieldId,
        checked: e.modelValue,
        disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
        "aria-invalid": e.ariaInvalid,
        "aria-required": e.ariaRequired,
        "aria-describedby": e.ariaDescribedby,
        "onUpdate:checked": l[0] || (l[0] = (t) => a("update:modelValue", t))
      }, null, 8, ["id", "checked", "disabled", "aria-invalid", "aria-required", "aria-describedby"])
    ]));
  }
}), W = {
  text: j,
  number: j,
  password: j,
  email: j,
  textarea: qe,
  select: je,
  checkbox: ze,
  radio: Oe,
  date: We,
  switch: Je
}, Qe = {
  key: 0,
  class: "text-destructive"
}, Xe = ["id"], Ye = ["id"], Ze = /* @__PURE__ */ g({
  __name: "FormFieldRenderer",
  props: {
    field: {},
    modelValue: {},
    error: {},
    componentMap: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: s }) {
    const a = e, o = s, l = k(() => `field-${a.field.name}`), t = k(() => `${l.value}-description`), c = k(() => `${l.value}-error`), n = k(() => {
      var y;
      return (y = a.field.validations) == null ? void 0 : y.some((h) => h.type === "required");
    }), I = k(() => {
      const y = [];
      return a.field.description && y.push(t.value), a.error && y.push(c.value), y.length > 0 ? y.join(" ") : void 0;
    }), E = k(
      () => a.componentMap ? { ...W, ...a.componentMap } : W
    ), V = k(
      () => E.value[a.field.type] ?? j
    );
    return (y, h) => (d(), m("div", {
      class: q(["space-y-2", e.field.className])
    }, [
      e.field.label ? (d(), x(O, {
        key: 0,
        for: l.value,
        class: q(n.value ? "flex items-center gap-1" : "")
      }, {
        default: p(() => [
          z(S(e.field.label) + " ", 1),
          n.value ? (d(), m("span", Qe, "*")) : $("", !0)
        ]),
        _: 1
      }, 8, ["for", "class"])) : $("", !0),
      (d(), x(Z(V.value), {
        field: e.field,
        "field-id": l.value,
        "model-value": e.modelValue,
        "aria-invalid": !!e.error,
        "aria-required": n.value,
        "aria-describedby": I.value,
        "onUpdate:modelValue": h[0] || (h[0] = (B) => o("update:modelValue", B)),
        onBlur: h[1] || (h[1] = (B) => o("blur", B))
      }, null, 40, ["field", "field-id", "model-value", "aria-invalid", "aria-required", "aria-describedby"])),
      e.field.description ? (d(), m("p", {
        key: 1,
        id: t.value,
        class: "text-[0.8rem] text-muted-foreground"
      }, S(e.field.description), 9, Xe)) : $("", !0),
      e.error ? (d(), m("p", {
        key: 2,
        id: c.value,
        class: "text-[0.8rem] font-medium text-destructive"
      }, S(e.error), 9, Ye)) : $("", !0)
    ], 2));
  }
}), _e = {
  key: 0,
  class: "space-y-1"
}, et = {
  key: 0,
  class: "font-semibold text-lg tracking-tight text-slate-800"
}, tt = {
  key: 1,
  class: "text-sm text-muted-foreground"
}, at = { class: "space-y-4" }, lt = {
  key: 0,
  class: "space-y-1 border-b border-slate-100 pb-2 flex justify-between items-center"
}, st = {
  key: 0,
  class: "font-semibold text-base tracking-tight text-slate-800"
}, ot = {
  key: 1,
  class: "text-xs text-muted-foreground"
}, dt = { class: "space-y-4" }, it = { class: "flex justify-between items-center border-b border-slate-50 pb-2" }, rt = { class: "text-xs font-semibold text-slate-500" }, nt = ["onClick"], ut = { class: "space-y-4" }, ct = ["onClick"], mt = /* @__PURE__ */ g({
  __name: "FormElementRenderer",
  props: {
    elements: {},
    formState: {},
    form: {},
    parentPath: { default: "" }
  },
  emits: ["change", "blur"],
  setup(e, { emit: s }) {
    const a = e, o = s, l = (u) => u.nodeType === "group", t = (u) => u.nodeType === "grid", c = (u) => u.nodeType === "list", n = (u) => !l(u) && !t(u) && !c(u), I = (u, f) => u.id || (n(u) ? u.name : `el-${f}`), E = (u, f, v) => {
      var D;
      const r = (D = f.computedStates) == null ? void 0 : D[v];
      return r ? r.hidden : typeof u.hidden == "function" ? u.hidden(f.values) : !!u.hidden;
    }, V = (u, f, v) => {
      var R;
      const r = (R = f.computedStates) == null ? void 0 : R[v], D = r ? r.disabled : typeof u.disabled == "function" ? u.disabled(f.values) : !!u.disabled, w = f.validatingFields.includes(v);
      return { ...u, name: v, disabled: D || w };
    }, y = (u) => ({ gridTemplateColumns: `repeat(${u.columns || 2}, minmax(0, 1fr))` }), h = (u) => a.parentPath ? `${a.parentPath}.${u.name}` : u.name, B = (u) => {
      const f = h(u);
      return a.form.getValue(f) || [];
    }, L = (u, f) => `${h(u)}[${f}]`;
    return (u, f) => {
      const v = _("FormElementRenderer", !0);
      return d(!0), m(T, null, M(e.elements, (r, D) => (d(), m(T, {
        key: I(r, D)
      }, [
        l(r) ? (d(), m("div", {
          key: 0,
          class: q(["space-y-4 p-4 border rounded-md", r.className])
        }, [
          r.title || r.description ? (d(), m("div", _e, [
            r.title ? (d(), m("h3", et, S(r.title), 1)) : $("", !0),
            r.description ? (d(), m("p", tt, S(r.description), 1)) : $("", !0)
          ])) : $("", !0),
          F("div", at, [
            b(v, {
              elements: r.elements,
              "form-state": e.formState,
              form: e.form,
              "parent-path": e.parentPath,
              onChange: f[0] || (f[0] = (w, R) => o("change", w, R)),
              onBlur: f[1] || (f[1] = (w) => o("blur", w))
            }, null, 8, ["elements", "form-state", "form", "parent-path"])
          ])
        ], 2)) : t(r) ? (d(), m("div", {
          key: 1,
          class: q(["grid gap-4", r.className]),
          style: ee(y(r))
        }, [
          b(v, {
            elements: r.elements,
            "form-state": e.formState,
            form: e.form,
            "parent-path": e.parentPath,
            onChange: f[2] || (f[2] = (w, R) => o("change", w, R)),
            onBlur: f[3] || (f[3] = (w) => o("blur", w))
          }, null, 8, ["elements", "form-state", "form", "parent-path"])
        ], 6)) : c(r) ? (d(), m("div", {
          key: 2,
          class: q(["space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50/50", r.className])
        }, [
          r.title || r.description ? (d(), m("div", lt, [
            F("div", null, [
              r.title ? (d(), m("h3", st, S(r.title), 1)) : $("", !0),
              r.description ? (d(), m("p", ot, S(r.description), 1)) : $("", !0)
            ])
          ])) : $("", !0),
          F("div", dt, [
            (d(!0), m(T, null, M(B(r), (w, R) => (d(), m("div", {
              key: `${I(r, D)}-${R}`,
              class: "p-4 border border-slate-100 bg-white rounded-md relative shadow-sm space-y-4"
            }, [
              F("div", it, [
                F("span", rt, "第 " + S(R + 1) + " 项", 1),
                F("button", {
                  type: "button",
                  onClick: (N) => e.form.removeListItem(r.name, R),
                  class: "text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                }, " 删除 ", 8, nt)
              ]),
              F("div", ut, [
                b(v, {
                  elements: r.elements,
                  "form-state": e.formState,
                  form: e.form,
                  "parent-path": L(r, R),
                  onChange: f[4] || (f[4] = (N, Q) => o("change", N, Q)),
                  onBlur: f[5] || (f[5] = (N) => o("blur", N))
                }, null, 8, ["elements", "form-state", "form", "parent-path"])
              ])
            ]))), 128))
          ]),
          F("button", {
            type: "button",
            onClick: (w) => e.form.appendListItem(r.name, {}),
            class: "w-full py-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 bg-white transition-all flex justify-center items-center gap-1 shadow-sm"
          }, " + 添加项 ", 8, ct)
        ], 2)) : n(r) && !E(r, e.formState, h(r)) ? (d(), x(Ze, {
          key: 3,
          field: V(r, e.formState, h(r)),
          "model-value": i(H)(e.formState.values, h(r)),
          error: e.formState.touched[h(r)] ? e.formState.errors[h(r)] : void 0,
          "onUpdate:modelValue": (w) => o("change", h(r), w),
          onBlur: (w) => o("blur", h(r))
        }, null, 8, ["field", "model-value", "error", "onUpdate:modelValue", "onBlur"])) : $("", !0)
      ], 64))), 128);
    };
  }
});
function ft({ schema: e }) {
  const s = oe(e, e.resolver, e.errorMessages), a = te(s.store.getState()), o = s.store.subscribe((V) => {
    a.value = V;
  });
  return ae(() => {
    o();
  }), {
    engine: s,
    state: a,
    // This is a Ref
    setValue: async (V, y) => {
      await s.setFieldValue(V, y);
    },
    getValue: (V) => H(a.value.values, V),
    validate: async () => {
      const { hasError: V, values: y } = await s.runSubmitValidation();
      return { hasError: V, values: y };
    },
    reset: () => {
      s.resetForm();
    },
    appendListItem: (V, y) => {
      s.appendListItem(V, y);
    },
    removeListItem: (V, y) => {
      s.removeListItem(V, y);
    }
  };
}
const pt = {
  key: 0,
  class: "space-y-1"
}, bt = {
  key: 0,
  class: "text-2xl font-bold tracking-tight"
}, yt = {
  key: 1,
  class: "text-muted-foreground"
}, gt = { class: "space-y-4" }, vt = ["disabled"], $t = /* @__PURE__ */ g({
  __name: "DynamicForm",
  props: {
    schema: {},
    className: {},
    form: {}
  },
  emits: ["submit", "submit-error"],
  setup(e, { emit: s }) {
    const a = e, o = s, l = ft({ schema: a.schema }), t = a.form || l, { engine: c, state: n } = t, I = async (B, L) => {
      await c.setFieldValue(B, L);
    }, E = async (B) => {
      await c.setFieldBlur(B);
    }, V = async () => {
      try {
        const { hasError: B, values: L } = await t.validate();
        if (B) {
          const f = de(a.schema.elements || a.schema.fields || []).find((v) => n.value.errors[v.name]);
          if (f) {
            const v = document.getElementById(`field-${f.name}`);
            v == null || v.focus(), v == null || v.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
        await o("submit", L);
      } catch (B) {
        o("submit-error", B);
      }
    }, y = k(() => n.value.validatingFields.length > 0), h = k(() => a.schema.elements || a.schema.fields || []);
    return (B, L) => (d(), m("form", {
      class: q(["space-y-6", e.className]),
      onSubmit: le(V, ["prevent"])
    }, [
      e.schema.title || e.schema.description ? (d(), m("div", pt, [
        e.schema.title ? (d(), m("h2", bt, S(e.schema.title), 1)) : $("", !0),
        e.schema.description ? (d(), m("p", yt, S(e.schema.description), 1)) : $("", !0)
      ])) : $("", !0),
      F("div", gt, [
        b(mt, {
          elements: h.value,
          "form-state": i(n),
          form: i(t),
          onChange: I,
          onBlur: E
        }, null, 8, ["elements", "form-state", "form"])
      ]),
      F("button", {
        type: "submit",
        disabled: i(n).isSubmitting || y.value,
        class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      }, S(i(n).isSubmitting ? "Submitting..." : y.value ? "Validating..." : e.schema.submitButtonText || "Submit"), 9, vt)
    ], 34));
  }
});
export {
  $t as DynamicForm,
  Ze as FormFieldRenderer,
  W as defaultComponentMap,
  ft as useForm
};
