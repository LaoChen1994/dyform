import { defineComponent as f, openBlock as n, createElementBlock as m, normalizeClass as S, unref as s, createBlock as p, computed as h, mergeProps as V, withCtx as r, renderSlot as w, createVNode as c, createElementVNode as I, normalizeProps as z, guardReactiveProps as N, Fragment as $, renderList as B, createTextVNode as C, toDisplayString as v, createCommentVNode as x, resolveDynamicComponent as T, ref as D, withModifiers as j } from "vue";
import { normalizeFieldValue as q, createFormRuntimeState as G, applyFieldChange as A, setSubmitting as E, runSubmitValidation as L } from "pdyform/core";
import { clsx as O } from "clsx";
import { twMerge as W } from "tailwind-merge";
import { useForwardProps as _, SelectTrigger as H, SelectIcon as J, SelectPortal as K, SelectContent as Q, SelectViewport as X, SelectItem as Y, SelectItemIndicator as Z, SelectItemText as ee, useForwardPropsEmits as P, SelectRoot as te, SelectValue as le, CheckboxRoot as ae, CheckboxIndicator as oe, Label as se, RadioGroupItem as de, RadioGroupIndicator as ne, RadioGroupRoot as ie } from "radix-vue";
import { ChevronDown as re, Check as U, Circle as ue } from "lucide-vue-next";
function y(...e) {
  return W(O(e));
}
const ce = ["type", "value"], me = /* @__PURE__ */ f({
  __name: "Input",
  props: {
    class: {},
    type: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: o }) {
    const a = e, d = o;
    return (l, t) => (n(), m("input", {
      type: e.type,
      class: S(s(y)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", a.class)),
      value: e.modelValue,
      onInput: t[0] || (t[0] = (u) => d("update:modelValue", u.target.value)),
      onBlur: t[1] || (t[1] = (u) => d("blur", u))
    }, null, 42, ce));
  }
}), k = /* @__PURE__ */ f({
  __name: "InputRenderer",
  props: {
    field: {},
    modelValue: {},
    fieldId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, d = o, l = (t) => {
      d("update:modelValue", q(a.field, t));
    };
    return (t, u) => (n(), p(me, {
      id: e.fieldId,
      type: e.field.type,
      placeholder: e.field.placeholder,
      disabled: e.field.disabled,
      name: e.field.name,
      modelValue: e.modelValue ?? "",
      "onUpdate:modelValue": l
    }, null, 8, ["id", "type", "placeholder", "disabled", "name", "modelValue"]));
  }
}), fe = ["value"], pe = /* @__PURE__ */ f({
  __name: "Textarea",
  props: {
    class: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(e, { emit: o }) {
    const a = e, d = o;
    return (l, t) => (n(), m("textarea", {
      class: S(s(y)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", a.class)),
      value: e.modelValue,
      onInput: t[0] || (t[0] = (u) => d("update:modelValue", u.target.value)),
      onBlur: t[1] || (t[1] = (u) => d("blur", u))
    }, null, 42, fe));
  }
}), be = /* @__PURE__ */ f({
  __name: "TextareaRenderer",
  props: {
    field: {},
    modelValue: {},
    fieldId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = o;
    return (d, l) => (n(), p(pe, {
      id: e.fieldId,
      placeholder: e.field.placeholder,
      disabled: e.field.disabled,
      name: e.field.name,
      modelValue: e.modelValue ?? "",
      "onUpdate:modelValue": l[0] || (l[0] = (t) => a("update:modelValue", t))
    }, null, 8, ["id", "placeholder", "disabled", "name", "modelValue"]));
  }
}), ge = /* @__PURE__ */ f({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, a = h(() => {
      const { class: l, ...t } = o;
      return t;
    }), d = _(a);
    return (l, t) => (n(), p(s(H), V(s(d), {
      class: s(y)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", o.class)
    }), {
      default: r(() => [
        w(l.$slots, "default"),
        c(s(J), { "as-child": "" }, {
          default: r(() => [
            c(s(re), { class: "h-4 w-4 opacity-50" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), he = /* @__PURE__ */ f({
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
    const o = e, a = h(() => {
      const { class: l, ...t } = o;
      return t;
    }), d = _(a);
    return (l, t) => (n(), p(s(K), null, {
      default: r(() => [
        c(s(Q), V(s(d), {
          class: s(y)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", o.class)
        }), {
          default: r(() => [
            c(s(X), {
              class: S(s(y)("p-1", e.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"))
            }, {
              default: r(() => [
                w(l.$slots, "default")
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
}), ye = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, ve = /* @__PURE__ */ f({
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
    const o = e, a = h(() => {
      const { class: l, ...t } = o;
      return t;
    }), d = _(a);
    return (l, t) => (n(), p(s(Y), V(s(d), {
      class: s(y)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        o.class
      )
    }), {
      default: r(() => [
        I("span", ye, [
          c(s(Z), null, {
            default: r(() => [
              c(s(U), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        c(s(ee), null, {
          default: r(() => [
            w(l.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), xe = /* @__PURE__ */ f({
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
  setup(e, { emit: o }) {
    const l = P(e, o);
    return (t, u) => (n(), p(s(te), z(N(s(l))), {
      default: r(() => [
        w(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Ve = /* @__PURE__ */ f({
  __name: "SelectRenderer",
  props: {
    field: {},
    modelValue: {},
    fieldId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = o;
    return (d, l) => (n(), p(xe, {
      disabled: e.field.disabled,
      name: e.field.name,
      modelValue: e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": l[0] || (l[0] = (t) => a("update:modelValue", t))
    }, {
      default: r(() => [
        c(ge, { id: e.fieldId }, {
          default: r(() => [
            c(s(le), {
              placeholder: e.field.placeholder || "Select an option"
            }, null, 8, ["placeholder"])
          ]),
          _: 1
        }, 8, ["id"]),
        c(he, null, {
          default: r(() => [
            (n(!0), m($, null, B(e.field.options, (t) => (n(), p(ve, {
              key: t.value,
              value: String(t.value)
            }, {
              default: r(() => [
                C(v(t.label), 1)
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
}), ke = /* @__PURE__ */ f({
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
  setup(e, { emit: o }) {
    const a = e, d = o, l = h(() => {
      const { class: u, ...i } = a;
      return i;
    }), t = P(l, d);
    return (u, i) => (n(), p(s(ae), V(s(t), {
      class: s(y)("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", a.class),
      onBlur: i[0] || (i[0] = (b) => d("blur"))
    }), {
      default: r(() => [
        c(s(oe), { class: "flex h-full w-full items-center justify-center text-current" }, {
          default: r(() => [
            c(s(U), { class: "h-4 w-4" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), R = /* @__PURE__ */ f({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, a = h(() => {
      const { class: d, ...l } = o;
      return l;
    });
    return (d, l) => (n(), p(s(se), V(a.value, {
      class: s(y)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", o.class)
    }), {
      default: r(() => [
        w(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), we = { class: "flex flex-wrap gap-4" }, $e = /* @__PURE__ */ f({
  __name: "CheckboxRenderer",
  props: {
    field: {},
    modelValue: {},
    fieldId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, d = o, l = (t, u) => {
      const i = Array.isArray(a.modelValue) ? [...a.modelValue] : [];
      if (u)
        i.push(t);
      else {
        const b = i.indexOf(t);
        b > -1 && i.splice(b, 1);
      }
      d("update:modelValue", i);
    };
    return (t, u) => (n(), m("div", we, [
      (n(!0), m($, null, B(e.field.options, (i) => (n(), m("div", {
        key: i.value,
        class: "flex items-center space-x-2"
      }, [
        c(ke, {
          id: `checkbox-${e.field.name}-${i.value}`,
          disabled: e.field.disabled,
          checked: Array.isArray(e.modelValue) && e.modelValue.includes(i.value),
          "onUpdate:checked": (b) => l(i.value, !!b)
        }, null, 8, ["id", "disabled", "checked", "onUpdate:checked"]),
        c(R, {
          for: `checkbox-${e.field.name}-${i.value}`,
          class: "font-normal"
        }, {
          default: r(() => [
            C(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["for"])
      ]))), 128))
    ]));
  }
}), Se = /* @__PURE__ */ f({
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
    const o = e, a = h(() => {
      const { class: l, ...t } = o;
      return t;
    }), d = _(a);
    return (l, t) => (n(), p(s(de), V(s(d), {
      class: s(y)("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", o.class)
    }), {
      default: r(() => [
        c(s(ne), { class: "flex items-center justify-center" }, {
          default: r(() => [
            c(s(ue), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Be = /* @__PURE__ */ f({
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
  setup(e, { emit: o }) {
    const a = e, d = o, l = h(() => {
      const { class: u, ...i } = a;
      return i;
    }), t = P(l, d);
    return (u, i) => (n(), p(s(ie), V(s(t), {
      class: s(y)("grid gap-2", a.class)
    }), {
      default: r(() => [
        w(u.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ce = /* @__PURE__ */ f({
  __name: "RadioRenderer",
  props: {
    field: {},
    modelValue: {},
    fieldId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = o;
    return (d, l) => (n(), p(Be, {
      class: "flex flex-wrap gap-4",
      disabled: e.field.disabled,
      name: e.field.name,
      modelValue: e.modelValue != null ? String(e.modelValue) : "",
      "onUpdate:modelValue": l[0] || (l[0] = (t) => a("update:modelValue", t))
    }, {
      default: r(() => [
        (n(!0), m($, null, B(e.field.options, (t) => (n(), m("div", {
          key: t.value,
          class: "flex items-center space-x-2"
        }, [
          c(Se, {
            id: `radio-${e.field.name}-${t.value}`,
            value: String(t.value)
          }, null, 8, ["id", "value"]),
          c(R, {
            for: `radio-${e.field.name}-${t.value}`,
            class: "font-normal"
          }, {
            default: r(() => [
              C(v(t.label), 1)
            ]),
            _: 2
          }, 1032, ["for"])
        ]))), 128))
      ]),
      _: 1
    }, 8, ["disabled", "name", "modelValue"]));
  }
}), F = {
  text: k,
  number: k,
  password: k,
  email: k,
  date: k,
  textarea: be,
  select: Ve,
  checkbox: $e,
  radio: Ce
}, _e = {
  key: 1,
  class: "text-[0.8rem] text-muted-foreground"
}, Ie = {
  key: 2,
  class: "text-[0.8rem] font-medium text-destructive"
}, Pe = /* @__PURE__ */ f({
  __name: "FormFieldRenderer",
  props: {
    field: {},
    modelValue: {},
    error: {},
    componentMap: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, d = o, l = h(() => `field-${a.field.name}`), t = h(
      () => a.componentMap ? { ...F, ...a.componentMap } : F
    ), u = h(
      () => t.value[a.field.type] ?? k
    );
    return (i, b) => (n(), m("div", {
      class: S(["space-y-2", e.field.className])
    }, [
      e.field.label ? (n(), p(R, {
        key: 0,
        for: l.value
      }, {
        default: r(() => [
          C(v(e.field.label), 1)
        ]),
        _: 1
      }, 8, ["for"])) : x("", !0),
      (n(), p(T(u.value), {
        field: e.field,
        fieldId: l.value,
        modelValue: e.modelValue,
        "onUpdate:modelValue": b[0] || (b[0] = (g) => d("update:modelValue", g))
      }, null, 8, ["field", "fieldId", "modelValue"])),
      e.field.description ? (n(), m("p", _e, v(e.field.description), 1)) : x("", !0),
      e.error ? (n(), m("p", Ie, v(e.error), 1)) : x("", !0)
    ], 2));
  }
}), Re = {
  key: 0,
  class: "space-y-1"
}, Fe = {
  key: 0,
  class: "text-2xl font-bold tracking-tight"
}, Ue = {
  key: 1,
  class: "text-muted-foreground"
}, Me = { class: "space-y-4" }, ze = ["disabled"], Ae = /* @__PURE__ */ f({
  __name: "DynamicForm",
  props: {
    schema: {},
    className: {}
  },
  emits: ["submit"],
  setup(e, { emit: o }) {
    const a = e, d = o, l = D(G(a.schema.fields)), t = (i, b) => {
      l.value = A(a.schema.fields, l.value, i, b);
    }, u = () => {
      const i = E(l.value, !0), { state: b, hasError: g } = L(a.schema.fields, i);
      l.value = b, g || d("submit", { ...b.values });
    };
    return (i, b) => (n(), m("form", {
      class: S(["space-y-6", e.className]),
      onSubmit: j(u, ["prevent"])
    }, [
      e.schema.title || e.schema.description ? (n(), m("div", Re, [
        e.schema.title ? (n(), m("h2", Fe, v(e.schema.title), 1)) : x("", !0),
        e.schema.description ? (n(), m("p", Ue, v(e.schema.description), 1)) : x("", !0)
      ])) : x("", !0),
      I("div", Me, [
        (n(!0), m($, null, B(e.schema.fields, (g) => (n(), m($, {
          key: g.id
        }, [
          g.hidden ? x("", !0) : (n(), p(Pe, {
            key: 0,
            field: g,
            "model-value": l.value.values[g.name],
            error: l.value.errors[g.name],
            "onUpdate:modelValue": (M) => t(g.name, M)
          }, null, 8, ["field", "model-value", "error", "onUpdate:modelValue"]))
        ], 64))), 128))
      ]),
      I("button", {
        type: "submit",
        disabled: l.value.isSubmitting,
        class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      }, v(l.value.isSubmitting ? "Submitting..." : e.schema.submitButtonText || "Submit"), 9, ze)
    ], 34));
  }
});
export {
  Ae as DynamicForm,
  Pe as FormFieldRenderer,
  F as defaultComponentMap
};
