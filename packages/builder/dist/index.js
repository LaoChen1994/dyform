"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  FormBuilder: () => FormBuilder
});
module.exports = __toCommonJS(index_exports);
var import_react3 = require("react");
var import_core3 = require("@dnd-kit/core");

// src/store/index.ts
var import_zustand = require("zustand");
var import_immer = require("zustand/middleware/immer");
var useBuilderStore = (0, import_zustand.create)()(
  (0, import_immer.immer)((set) => ({
    schema: {
      title: "New Form",
      elements: []
    },
    selectedElementId: null,
    setSchema: (schema) => set((state) => {
      state.schema = schema;
    }),
    selectElement: (id) => set((state) => {
      state.selectedElementId = id;
    }),
    addElement: (element) => set((state) => {
      if (!state.schema.elements) {
        state.schema.elements = [];
      }
      state.schema.elements.push(element);
    }),
    updateElement: (id, updates) => set((state) => {
      const updateNode = (elements) => {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].id === id) {
            Object.assign(elements[i], updates);
            return true;
          }
          if (elements[i].nodeType === "group" || elements[i].nodeType === "grid") {
            if (elements[i].elements) {
              if (updateNode(elements[i].elements)) {
                return true;
              }
            }
          }
        }
        return false;
      };
      if (state.schema.elements) {
        updateNode(state.schema.elements);
      }
    }),
    removeElement: (id) => set((state) => {
      const removeNode = (elements) => {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].id === id) {
            elements.splice(i, 1);
            return true;
          }
          if (elements[i].nodeType === "group" || elements[i].nodeType === "grid") {
            if (elements[i].elements) {
              if (removeNode(elements[i].elements)) {
                return true;
              }
            }
          }
        }
        return false;
      };
      if (state.schema.elements) {
        removeNode(state.schema.elements);
      }
      if (state.selectedElementId === id) {
        state.selectedElementId = null;
      }
    }),
    moveElement: (fromIndex, toIndex) => set((state) => {
      if (!state.schema.elements) return;
      const [moved] = state.schema.elements.splice(fromIndex, 1);
      state.schema.elements.splice(toIndex, 0, moved);
    })
  }))
);

// src/components/Sidebar.tsx
var import_core = require("@dnd-kit/core");
var import_jsx_runtime = require("react/jsx-runtime");
var fieldTemplates = [
  { type: "text", label: "\u5355\u884C\u6587\u672C" },
  { type: "number", label: "\u6570\u5B57\u8F93\u5165" },
  { type: "select", label: "\u4E0B\u62C9\u9009\u62E9" },
  { type: "switch", label: "\u5F00\u5173\u63A7\u4EF6" },
  { type: "date", label: "\u65E5\u671F\u9009\u62E9" }
];
function DraggableField({ field }) {
  const { attributes, listeners, setNodeRef, isDragging } = (0, import_core.useDraggable)({
    id: `template-${field.type}`,
    data: {
      isTemplate: true,
      type: field.type,
      label: field.label
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref: setNodeRef,
      ...listeners,
      ...attributes,
      className: `p-3 mb-2 bg-white border border-slate-200 rounded cursor-grab hover:border-blue-500 hover:shadow-sm flex items-center gap-3 ${isDragging ? "opacity-50" : ""}`,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-medium", children: field.label })
    }
  );
}
function Sidebar() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-64 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "font-semibold mb-4 text-slate-800", children: "\u57FA\u7840\u7EC4\u4EF6" }),
    fieldTemplates.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableField, { field }, field.type))
  ] });
}

// src/components/Canvas.tsx
var import_react = __toESM(require("react"));
var import_core2 = require("@dnd-kit/core");
var import_sortable = require("@dnd-kit/sortable");
var import_utilities = require("@dnd-kit/utilities");
var import_pdyform_react = require("pdyform-react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var SortableFieldWrapper = import_react.default.memo(({
  element,
  isSelected,
  onSelect
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = (0, import_sortable.useSortable)({
    id: element.id,
    data: {
      isElement: true,
      element
    }
  });
  const style = {
    transform: import_utilities.CSS.Transform.toString(transform),
    transition
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      ref: setNodeRef,
      style,
      onClick: (e) => {
        e.stopPropagation();
        onSelect(element.id);
      },
      className: `relative p-4 mb-2 rounded border-2 transition-colors cursor-pointer bg-white ${isSelected ? "border-blue-500 bg-blue-50/10" : "border-transparent hover:border-slate-200 hover:bg-slate-50"} ${isDragging ? "opacity-30" : ""}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            ...attributes,
            ...listeners,
            className: "absolute top-2 right-2 w-6 h-6 flex items-center justify-center cursor-grab text-slate-400 hover:text-slate-600 z-10 bg-slate-100 rounded",
            children: "\u22EE\u22EE"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_pdyform_react.DynamicForm, { schema: { elements: [element] }, onSubmit: () => {
        }, hideSubmitButton: true }) })
      ]
    }
  );
});
function Canvas() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const selectElement = useBuilderStore((s) => s.selectElement);
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const { setNodeRef, isOver } = (0, import_core2.useDroppable)({
    id: "canvas-droppable"
  });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      className: "flex-1 p-8 overflow-auto bg-slate-100",
      onClick: () => selectElement(null),
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "div",
        {
          ref: setNodeRef,
          className: `max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm min-h-[600px] transition-colors ${isOver ? "ring-2 ring-blue-400 bg-blue-50/10" : ""}`,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { className: "text-2xl font-bold mb-6 pb-4 border-b border-slate-100", children: schema.title || "\u672A\u547D\u540D\u8868\u5355" }),
            elements.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "h-40 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 pointer-events-none", children: "\u8BF7\u5C06\u5DE6\u4FA7\u7EC4\u4EF6\u62D6\u62FD\u81F3\u6B64\u5904" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              import_sortable.SortableContext,
              {
                items: elements.map((e) => e.id),
                strategy: import_sortable.verticalListSortingStrategy,
                children: elements.map((element) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  SortableFieldWrapper,
                  {
                    element,
                    isSelected: selectedElementId === element.id,
                    onSelect: selectElement
                  },
                  element.id
                ))
              }
            )
          ]
        }
      )
    }
  );
}

// src/components/PropertyPanel.tsx
var import_react2 = require("react");
var import_pdyform_react2 = require("pdyform-react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function PropertyPanel() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const updateElement = useBuilderStore((s) => s.updateElement);
  const removeElement = useBuilderStore((s) => s.removeElement);
  const selectedElement = elements.find((e) => e.id === selectedElementId);
  const propertySchema = (0, import_react2.useMemo)(() => {
    if (!selectedElement) return { elements: [] };
    return {
      elements: [
        {
          id: "label",
          name: "label",
          label: "\u6807\u9898",
          type: "text",
          defaultValue: selectedElement.label,
          validations: [{ type: "required" }]
        },
        {
          id: "name",
          name: "name",
          label: "\u5B57\u6BB5\u6807\u8BC6 (Name)",
          type: "text",
          defaultValue: selectedElement.name,
          validations: [{ type: "required" }]
        },
        {
          id: "placeholder",
          name: "placeholder",
          label: "\u5360\u4F4D\u63D0\u793A",
          type: "text",
          defaultValue: selectedElement.placeholder
        },
        {
          id: "required",
          name: "required",
          label: "\u662F\u5426\u5FC5\u586B",
          type: "switch",
          defaultValue: !!selectedElement.validations?.find((v) => v.type === "required")
        }
      ]
    };
  }, [selectedElement?.id]);
  const form = (0, import_pdyform_react2.useForm)({ schema: propertySchema });
  (0, import_react2.useEffect)(() => {
    if (!selectedElement) return;
    let timer;
    const unsubscribe = form.engine.store.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const state = form.engine.store.getState();
        const currentVals = state.values;
        if (currentVals && Object.keys(currentVals).length > 0) {
          const updates = {
            label: currentVals.label,
            name: currentVals.name,
            placeholder: currentVals.placeholder
          };
          if (currentVals.required) {
            updates.validations = [{ type: "required" }];
          } else {
            updates.validations = [];
          }
          updateElement(selectedElement.id, updates);
        }
      }, 300);
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [form.engine.store, selectedElement?.id, updateElement]);
  if (!selectedElement) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-80 border-l border-slate-200 bg-slate-50 p-4 text-slate-400 text-sm text-center pt-20", children: "\u8BF7\u5148\u5728\u753B\u5E03\u4E2D\u9009\u4E2D\u4E00\u4E2A\u7EC4\u4EF6" });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "w-80 border-l border-slate-200 bg-white flex flex-col h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "p-4 border-b border-slate-100 flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "font-semibold text-slate-800", children: "\u5C5E\u6027\u914D\u7F6E" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          onClick: () => removeElement(selectedElement.id),
          className: "text-red-500 hover:text-red-600 text-sm font-medium",
          children: "\u5220\u9664"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "p-4 flex-1 overflow-y-auto", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_pdyform_react2.DynamicForm,
      {
        form,
        schema: propertySchema,
        onSubmit: () => {
        },
        hideSubmitButton: true
      }
    ) })
  ] });
}

// src/index.tsx
var import_pdyform_react3 = require("pdyform-react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function FormBuilder() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const addElement = useBuilderStore((s) => s.addElement);
  const moveElement = useBuilderStore((s) => s.moveElement);
  const selectElement = useBuilderStore((s) => s.selectElement);
  const [activeData, setActiveData] = (0, import_react3.useState)(null);
  const handleDragStart = (event) => {
    setActiveData(event.active.data.current);
  };
  const handleDragEnd = (event) => {
    setActiveData(null);
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.isTemplate) {
      const newField = {
        nodeType: "field",
        id: `field_${Date.now()}`,
        name: `field_${Date.now()}`,
        type: active.data.current.type,
        label: active.data.current.label
      };
      addElement(newField);
      selectElement(newField.id);
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        moveElement(oldIndex, newIndex);
      }
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_core3.DndContext, { collisionDetection: import_core3.closestCenter, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex h-full w-full bg-slate-50 text-slate-900 overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Sidebar, {}),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Canvas, {}),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PropertyPanel, {}),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_core3.DragOverlay, { children: [
      activeData?.isTemplate ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "p-3 bg-white border-2 border-blue-500 rounded shadow-lg flex items-center gap-3 opacity-90 cursor-grabbing", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-sm font-medium", children: activeData.label }) }) : null,
      activeData?.isElement ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "p-4 bg-white border-2 border-blue-500 rounded shadow-lg opacity-90 cursor-grabbing", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_pdyform_react3.DynamicForm, { schema: { elements: [activeData.element] }, onSubmit: () => {
      }, hideSubmitButton: true }) }) }) : null
    ] })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FormBuilder
});
