import { defineComponent as m, openBlock as n, createElementBlock as f, mergeProps as V, unref as o, createBlock as p, computed as y, withCtx as u, renderSlot as C, createVNode as c, normalizeClass as P, createElementVNode as z, normalizeProps as W, guardReactiveProps as H, Fragment as D, renderList as U, createTextVNode as E, toDisplayString as B, createCommentVNode as $, resolveDynamicComponent as J, ref as K, onUnmounted as Q, withModifiers as X } from "vue";
import { normalizeFieldValue as Y, createFormEngine as Z, get as G, flattenElements as _ } from "pdyform-core";
import { clsx as ee } from "clsx";
import { twMerge as ae } from "tailwind-merge";
import { useForwardProps as M, SelectTrigger as te, SelectIcon as le, SelectPortal as de, SelectContent as oe, SelectViewport as ie, SelectItem as se, SelectItemIndicator as ne, SelectItemText as re, useForwardPropsEmits as T, SelectRoot as ue, SelectValue as ce, CheckboxRoot as me, CheckboxIndicator as fe, Label as pe, RadioGroupItem as be, RadioGroupIndicator as ve, RadioGroupRoot as ye, SwitchRoot as ge, SwitchThumb as he } from "radix-vue";
import { ChevronDown as xe, Check as L, Circle as Ve } from "lucide-vue-next";
function g(...e) {
  return ae(ee(e));
}
const Be = ["type", "value"], O = /* @__PURE__ */ m({
  __name: "Input",
  props: {
    class: {},
    type: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: d }) {
    const t = e, i = d;
    return (l, a) => (n(), f("input", V(l.$attrs, {
      type: e.type,
      class: o(g)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class),
      value: e.modelValue,
      onInput: a[0] || (a[0] = (r) => i("update:modelValue", r.target.value)),
      onBlur: a[1] || (a[1] = (r) => i("blur", r))
    }), null, 16, Be));
  }
}), q = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = e, i = d, l = (a) => {
      i("update:modelValue", Y(t.field, a));
    };
    return (a, r) => (n(), p(O, {
      id: e.fieldId,
      type: e.field.type,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue ?? "",
      "onUpdate:modelValue": l,
      onBlur: r[0] || (r[0] = (s) => i("blur", s))
    }, null, 8, ["id", "type", "placeholder", "disabled", "name", "model-value"]));
  }
}), we = ["value"], ke = /* @__PURE__ */ m({
  __name: "Textarea",
  props: {
    class: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: d }) {
    const t = e, i = d;
    return (l, a) => (n(), f("textarea", V(l.$attrs, {
      class: o(g)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class),
      value: e.modelValue,
      onInput: a[0] || (a[0] = (r) => i("update:modelValue", r.target.value)),
      onBlur: a[1] || (a[1] = (r) => i("blur", r))
    }), null, 16, we));
  }
}), $e = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = d;
    return (i, l) => (n(), p(ke, {
      id: e.fieldId,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue ?? "",
      "onUpdate:modelValue": l[0] || (l[0] = (a) => t("update:modelValue", a))
    }, null, 8, ["id", "placeholder", "disabled", "name", "model-value"]));
  }
}), Ie = /* @__PURE__ */ m({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const d = e, t = y(() => {
      const { class: l, ...a } = d;
      return a;
    }), i = M(t);
    return (l, a) => (n(), p(o(te), V(o(i), {
      class: o(g)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", d.class)
    }), {
      default: u(() => [
        C(l.$slots, "default"),
        c(o(le), { "as-child": "" }, {
          default: u(() => [
            c(o(xe), { class: "h-4 w-4 opacity-50" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Se = /* @__PURE__ */ m({
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
    const d = e, t = y(() => {
      const { class: l, ...a } = d;
      return a;
    }), i = M(t);
    return (l, a) => (n(), p(o(de), null, {
      default: u(() => [
        c(o(oe), V(o(i), {
          class: o(g)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", d.class)
        }), {
          default: u(() => [
            c(o(ie), {
              class: P(o(g)("p-1", e.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"))
            }, {
              default: u(() => [
                C(l.$slots, "default")
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
}), Re = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, Ce = /* @__PURE__ */ m({
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
    const d = e, t = y(() => {
      const { class: l, ...a } = d;
      return a;
    }), i = M(t);
    return (l, a) => (n(), p(o(se), V(o(i), {
      class: o(g)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        d.class
      )
    }), {
      default: u(() => [
        z("span", Re, [
          c(o(ne), null, {
            default: u(() => [
              c(o(L), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        c(o(re), null, {
          default: u(() => [
            C(l.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Fe = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const l = T(e, d);
    return (a, r) => (n(), p(o(ue), W(H(o(l))), {
      default: u(() => [
        C(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), qe = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = d;
    return (i, l) => (n(), p(Fe, {
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": l[0] || (l[0] = (a) => t("update:modelValue", a))
    }, {
      default: u(() => [
        c(Ie, { id: e.fieldId }, {
          default: u(() => [
            c(o(ce), {
              placeholder: e.field.placeholder || "Select an option"
            }, null, 8, ["placeholder"])
          ]),
          _: 1
        }, 8, ["id"]),
        c(Se, null, {
          default: u(() => [
            (n(!0), f(D, null, U(e.field.options, (a) => (n(), p(Ce, {
              key: a.value,
              value: String(a.value)
            }, {
              default: u(() => [
                E(B(a.label), 1)
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
}), Pe = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = e, i = d, l = y(() => {
      const { class: r, ...s } = t;
      return s;
    }), a = T(l, i);
    return (r, s) => (n(), p(o(me), V(o(a), {
      class: o(g)("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", t.class),
      onBlur: s[0] || (s[0] = (b) => i("blur"))
    }), {
      default: u(() => [
        c(o(fe), { class: "flex h-full w-full items-center justify-center text-current" }, {
          default: u(() => [
            c(o(L), { class: "h-4 w-4" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), N = /* @__PURE__ */ m({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const d = e, t = y(() => {
      const { class: i, ...l } = d;
      return l;
    });
    return (i, l) => (n(), p(o(pe), V(t.value, {
      class: o(g)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", d.class)
    }), {
      default: u(() => [
        C(i.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), De = { class: "flex flex-wrap gap-4" }, Ue = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = e, i = d, l = (a, r) => {
      const s = Array.isArray(t.modelValue) ? [...t.modelValue] : [];
      if (r)
        s.push(a);
      else {
        const b = s.indexOf(a);
        b > -1 && s.splice(b, 1);
      }
      i("update:modelValue", s);
    };
    return (a, r) => (n(), f("div", De, [
      (n(!0), f(D, null, U(e.field.options, (s) => (n(), f("div", {
        key: s.value,
        class: "flex items-center space-x-2"
      }, [
        c(Pe, {
          id: `checkbox-${e.field.name}-${s.value}`,
          disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
          checked: Array.isArray(e.modelValue) && e.modelValue.includes(s.value),
          "onUpdate:checked": (b) => l(s.value, !!b)
        }, null, 8, ["id", "disabled", "checked", "onUpdate:checked"]),
        c(N, {
          for: `checkbox-${e.field.name}-${s.value}`,
          class: "font-normal"
        }, {
          default: u(() => [
            E(B(s.label), 1)
          ]),
          _: 2
        }, 1032, ["for"])
      ]))), 128))
    ]));
  }
}), Ee = /* @__PURE__ */ m({
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
    const d = e, t = y(() => {
      const { class: l, ...a } = d;
      return a;
    }), i = M(t);
    return (l, a) => (n(), p(o(be), V(o(i), {
      class: o(g)("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", d.class)
    }), {
      default: u(() => [
        c(o(ve), { class: "flex items-center justify-center" }, {
          default: u(() => [
            c(o(Ve), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Me = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = e, i = d, l = y(() => {
      const { class: r, ...s } = t;
      return s;
    }), a = T(l, i);
    return (r, s) => (n(), p(o(ye), V(o(a), {
      class: o(g)("grid gap-2", t.class)
    }), {
      default: u(() => [
        C(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Te = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = d;
    return (i, l) => (n(), p(Me, {
      class: "flex flex-wrap gap-4",
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "model-value": e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": l[0] || (l[0] = (a) => t("update:modelValue", a))
    }, {
      default: u(() => [
        (n(!0), f(D, null, U(e.field.options, (a) => (n(), f("div", {
          key: a.value,
          class: "flex items-center space-x-2"
        }, [
          c(Ee, {
            id: `radio-${e.field.name}-${a.value}`,
            value: String(a.value)
          }, null, 8, ["id", "value"]),
          c(N, {
            for: `radio-${e.field.name}-${a.value}`,
            class: "font-normal"
          }, {
            default: u(() => [
              E(B(a.label), 1)
            ]),
            _: 2
          }, 1032, ["for"])
        ]))), 128))
      ]),
      _: 1
    }, 8, ["disabled", "name", "model-value"]));
  }
}), je = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = d;
    return (i, l) => (n(), p(O, {
      id: e.fieldId,
      type: "date",
      "model-value": e.modelValue,
      placeholder: e.field.placeholder,
      disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
      name: e.field.name,
      "aria-invalid": e.ariaInvalid,
      "aria-required": e.ariaRequired,
      "aria-describedby": e.ariaDescribedby,
      "onUpdate:modelValue": l[0] || (l[0] = (a) => t("update:modelValue", a)),
      onBlur: l[1] || (l[1] = (a) => t("blur", a))
    }, null, 8, ["id", "model-value", "placeholder", "disabled", "name", "aria-invalid", "aria-required", "aria-describedby"]));
  }
}), ze = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = e, i = d, l = y(() => {
      const { class: r, ...s } = t;
      return s;
    }), a = T(l, i);
    return (r, s) => (n(), p(o(ge), V(o(a), {
      class: o(g)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        t.class
      )
    }), {
      default: u(() => [
        c(o(he), {
          class: P(o(g)(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          ))
        }, null, 8, ["class"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Ne = { class: "flex items-center space-x-2" }, Ae = /* @__PURE__ */ m({
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
  setup(e, { emit: d }) {
    const t = d;
    return (i, l) => (n(), f("div", Ne, [
      c(ze, {
        id: e.fieldId,
        checked: e.modelValue,
        disabled: typeof e.field.disabled == "boolean" ? e.field.disabled : void 0,
        "aria-invalid": e.ariaInvalid,
        "aria-required": e.ariaRequired,
        "aria-describedby": e.ariaDescribedby,
        "onUpdate:checked": l[0] || (l[0] = (a) => t("update:modelValue", a))
      }, null, 8, ["id", "checked", "disabled", "aria-invalid", "aria-required", "aria-describedby"])
    ]));
  }
}), A = {
  text: q,
  number: q,
  password: q,
  email: q,
  textarea: $e,
  select: qe,
  checkbox: Ue,
  radio: Te,
  date: je,
  switch: Ae
}, Ge = {
  key: 0,
  class: "text-destructive"
}, Le = ["id"], Oe = ["id"], We = /* @__PURE__ */ m({
  __name: "FormFieldRenderer",
  props: {
    field: {},
    modelValue: {},
    error: {},
    componentMap: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: d }) {
    const t = e, i = d, l = y(() => `field-${t.field.name}`), a = y(() => `${l.value}-description`), r = y(() => `${l.value}-error`), s = y(() => {
      var h;
      return (h = t.field.validations) == null ? void 0 : h.some((w) => w.type === "required");
    }), b = y(() => {
      const h = [];
      return t.field.description && h.push(a.value), t.error && h.push(r.value), h.length > 0 ? h.join(" ") : void 0;
    }), I = y(
      () => t.componentMap ? { ...A, ...t.componentMap } : A
    ), j = y(
      () => I.value[t.field.type] ?? q
    );
    return (h, w) => (n(), f("div", {
      class: P(["space-y-2", e.field.className])
    }, [
      e.field.label ? (n(), p(N, {
        key: 0,
        for: l.value,
        class: P(s.value ? "flex items-center gap-1" : "")
      }, {
        default: u(() => [
          E(B(e.field.label) + " ", 1),
          s.value ? (n(), f("span", Ge, "*")) : $("", !0)
        ]),
        _: 1
      }, 8, ["for", "class"])) : $("", !0),
      (n(), p(J(j.value), {
        field: e.field,
        "field-id": l.value,
        "model-value": e.modelValue,
        "aria-invalid": !!e.error,
        "aria-required": s.value,
        "aria-describedby": b.value,
        "onUpdate:modelValue": w[0] || (w[0] = (S) => i("update:modelValue", S)),
        onBlur: w[1] || (w[1] = (S) => i("blur", S))
      }, null, 40, ["field", "field-id", "model-value", "aria-invalid", "aria-required", "aria-describedby"])),
      e.field.description ? (n(), f("p", {
        key: 1,
        id: a.value,
        class: "text-[0.8rem] text-muted-foreground"
      }, B(e.field.description), 9, Le)) : $("", !0),
      e.error ? (n(), f("p", {
        key: 2,
        id: r.value,
        class: "text-[0.8rem] font-medium text-destructive"
      }, B(e.error), 9, Oe)) : $("", !0)
    ], 2));
  }
});
function He({ schema: e }) {
  const d = Z(e, e.resolver, e.errorMessages), t = K(d.store.getState()), i = d.store.subscribe((b) => {
    t.value = b;
  });
  return Q(() => {
    i();
  }), {
    engine: d,
    state: t,
    // This is a Ref
    setValue: async (b, I) => {
      await d.setFieldValue(b, I);
    },
    getValue: (b) => G(t.value.values, b),
    validate: async () => {
      const { hasError: b, state: I } = await d.runSubmitValidation();
      return { hasError: b, values: I.values };
    },
    reset: () => {
      d.store.setState({
        values: {},
        errors: {},
        isSubmitting: !1
      });
    }
  };
}
const Je = {
  key: 0,
  class: "space-y-1"
}, Ke = {
  key: 0,
  class: "text-2xl font-bold tracking-tight"
}, Qe = {
  key: 1,
  class: "text-muted-foreground"
}, Xe = { class: "space-y-4" }, Ye = ["disabled"], da = /* @__PURE__ */ m({
  __name: "DynamicForm",
  props: {
    schema: {},
    className: {},
    form: {}
  },
  emits: ["submit"],
  setup(e, { emit: d }) {
    const t = e, i = d, l = He({ schema: t.schema }), a = t.form || l, { engine: r, state: s } = a, b = async (v, R) => {
      await r.setFieldValue(v, R);
    }, I = async (v) => {
      await r.setFieldBlur(v);
    }, j = (v) => typeof v.hidden == "function" ? v.hidden(s.value.values) : !!v.hidden, h = (v) => {
      const R = typeof v.disabled == "function" ? v.disabled(s.value.values) : !!v.disabled, x = s.value.validatingFields.includes(v.name);
      return { ...v, disabled: R || x };
    }, w = async () => {
      const { hasError: v, values: R } = await a.validate();
      if (v) {
        const F = _(t.schema.elements || t.schema.fields || []).find((k) => s.value.errors[k.name]);
        if (F) {
          const k = document.getElementById(`field-${F.name}`);
          k == null || k.focus(), k == null || k.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      await i("submit", R);
    }, S = y(() => s.value.validatingFields.length > 0);
    return (v, R) => (n(), f("form", {
      class: P(["space-y-6", e.className]),
      onSubmit: X(w, ["prevent"])
    }, [
      e.schema.title || e.schema.description ? (n(), f("div", Je, [
        e.schema.title ? (n(), f("h2", Ke, B(e.schema.title), 1)) : $("", !0),
        e.schema.description ? (n(), f("p", Qe, B(e.schema.description), 1)) : $("", !0)
      ])) : $("", !0),
      z("div", Xe, [
        (n(!0), f(D, null, U(e.schema.fields, (x) => (n(), f(D, {
          key: x.id
        }, [
          j(x) ? $("", !0) : (n(), p(We, {
            key: 0,
            field: h(x),
            "model-value": o(G)(o(s).values, x.name),
            error: o(s).errors[x.name],
            "onUpdate:modelValue": (F) => b(x.name, F),
            onBlur: (F) => I(x.name)
          }, null, 8, ["field", "model-value", "error", "onUpdate:modelValue", "onBlur"]))
        ], 64))), 128))
      ]),
      z("button", {
        type: "submit",
        disabled: o(s).isSubmitting || S.value,
        class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      }, B(o(s).isSubmitting ? "Submitting..." : S.value ? "Validating..." : e.schema.submitButtonText || "Submit"), 9, Ye)
    ], 34));
  }
});
export {
  da as DynamicForm,
  We as FormFieldRenderer,
  A as defaultComponentMap,
  He as useForm
};
