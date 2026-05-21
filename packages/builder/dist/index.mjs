// src/index.tsx
import { useState } from "react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";

// src/store/index.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
var useBuilderStore = create()(
  immer((set) => ({
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
    addChildElement: (parentId, element) => set((state) => {
      const addChildNode = (elements) => {
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.id === parentId) {
            if (!el.elements) el.elements = [];
            el.elements.push(element);
            return true;
          }
          if (el.nodeType === "group" || el.nodeType === "grid" || el.nodeType === "list") {
            if (el.elements) {
              if (addChildNode(el.elements)) {
                return true;
              }
            }
          }
        }
        return false;
      };
      if (state.schema.elements) {
        addChildNode(state.schema.elements);
      }
    }),
    updateElement: (id, updates) => set((state) => {
      const updateNode = (elements) => {
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.id === id) {
            Object.assign(el, updates);
            return true;
          }
          if (el.nodeType === "group" || el.nodeType === "grid" || el.nodeType === "list") {
            if (el.elements) {
              if (updateNode(el.elements)) {
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
          const el = elements[i];
          if (el.id === id) {
            elements.splice(i, 1);
            return true;
          }
          if (el.nodeType === "group" || el.nodeType === "grid" || el.nodeType === "list") {
            if (el.elements) {
              if (removeNode(el.elements)) {
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
import { useDraggable } from "@dnd-kit/core";
import { jsx, jsxs } from "react/jsx-runtime";
var layoutTemplates = [
  { type: "list", label: "\u52A8\u6001\u5217\u8868\u5BB9\u5668 (FormList)", isLayout: true },
  { type: "group", label: "\u5206\u7EC4\u9762\u677F\u5BB9\u5668 (Group)", isLayout: true },
  { type: "grid", label: "\u4E24\u5217\u7F51\u683C\u5E03\u5C40 (Grid)", isLayout: true }
];
var fieldTemplates = [
  { type: "text", label: "\u5355\u884C\u6587\u672C\u8F93\u5165 (Input)" },
  { type: "number", label: "\u6570\u5B57\u6570\u503C\u8F93\u5165 (Number)" },
  { type: "select", label: "\u4E0B\u62C9\u5355\u9009\u83DC\u5355 (Select)" },
  { type: "switch", label: "\u5F00\u5173\u9009\u62E9\u63A7\u5236 (Switch)" },
  { type: "date", label: "\u65E5\u671F\u65F6\u95F4\u9009\u62E9 (Date)" }
];
function DraggableField({ field }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${field.type}`,
    data: {
      isTemplate: true,
      type: field.type,
      label: field.label,
      isLayout: field.isLayout
    }
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: setNodeRef,
      ...listeners,
      ...attributes,
      className: `p-3 mb-2 bg-white border border-slate-200 rounded cursor-grab hover:border-blue-500 hover:shadow-md flex items-center justify-between transition-all ${isDragging ? "opacity-50 border-dashed border-blue-400" : ""} ${field.isLayout ? "border-indigo-100 bg-indigo-50/10" : ""}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: field.label }),
        field.isLayout && /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-1.5 py-0.5 rounded-sm", children: "\u5BB9\u5668" })
      ]
    }
  );
}
function Sidebar() {
  return /* @__PURE__ */ jsxs("div", { className: "w-64 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-400 tracking-wider uppercase mb-3", children: "\u5E03\u5C40\u5BB9\u5668" }),
      layoutTemplates.map((field) => /* @__PURE__ */ jsx(DraggableField, { field }, field.type))
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-400 tracking-wider uppercase mb-3", children: "\u8868\u5355\u5B57\u6BB5" }),
      fieldTemplates.map((field) => /* @__PURE__ */ jsx(DraggableField, { field }, field.type))
    ] })
  ] });
}

// src/components/Canvas.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DynamicForm } from "pdyform-react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var SortableFieldWrapper = React.memo(({
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
  } = useSortable({
    id: element.id,
    data: {
      isElement: true,
      element
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return /* @__PURE__ */ jsxs2(
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
        /* @__PURE__ */ jsx2(
          "div",
          {
            ...attributes,
            ...listeners,
            className: "absolute top-2 right-2 w-6 h-6 flex items-center justify-center cursor-grab text-slate-400 hover:text-slate-600 z-10 bg-slate-100 rounded",
            children: "\u22EE\u22EE"
          }
        ),
        /* @__PURE__ */ jsx2("div", { className: "pointer-events-none", children: /* @__PURE__ */ jsx2(DynamicForm, { schema: { elements: [element] }, onSubmit: () => {
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
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-droppable"
  });
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: "flex-1 p-8 overflow-auto bg-slate-100",
      onClick: () => selectElement(null),
      children: /* @__PURE__ */ jsxs2(
        "div",
        {
          ref: setNodeRef,
          className: `max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm min-h-[600px] transition-colors ${isOver ? "ring-2 ring-blue-400 bg-blue-50/10" : ""}`,
          children: [
            /* @__PURE__ */ jsx2("h1", { className: "text-2xl font-bold mb-6 pb-4 border-b border-slate-100", children: schema.title || "\u672A\u547D\u540D\u8868\u5355" }),
            elements.length === 0 && /* @__PURE__ */ jsx2("div", { className: "h-40 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 pointer-events-none", children: "\u8BF7\u5C06\u5DE6\u4FA7\u7EC4\u4EF6\u62D6\u62FD\u81F3\u6B64\u5904" }),
            /* @__PURE__ */ jsx2(
              SortableContext,
              {
                items: elements.map((e) => e.id),
                strategy: verticalListSortingStrategy,
                children: elements.map((element) => /* @__PURE__ */ jsx2(
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
import { useMemo, useEffect } from "react";
import { DynamicForm as DynamicForm2, useForm } from "pdyform-react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var findElementById = (elements, id) => {
  if (!id) return void 0;
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.nodeType === "group" || el.nodeType === "grid" || el.nodeType === "list") {
      const found = findElementById(el.elements || [], id);
      if (found) return found;
    }
  }
  return void 0;
};
function PropertyPanel() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const selectElement = useBuilderStore((s) => s.selectElement);
  const updateElement = useBuilderStore((s) => s.updateElement);
  const removeElement = useBuilderStore((s) => s.removeElement);
  const addChildElement = useBuilderStore((s) => s.addChildElement);
  const selectedElement = useMemo(() => {
    return findElementById(elements, selectedElementId);
  }, [elements, selectedElementId]);
  const propertySchema = useMemo(() => {
    if (!selectedElement) return { elements: [] };
    const commonFields = [
      {
        id: "id",
        name: "id",
        label: "\u7EC4\u4EF6\u5185\u90E8ID (\u53EA\u8BFB)",
        type: "text",
        defaultValue: selectedElement.id,
        disabled: true
      }
    ];
    if (selectedElement.nodeType === "group") {
      return {
        elements: [
          ...commonFields,
          {
            id: "title",
            name: "title",
            label: "\u5206\u7EC4\u6807\u9898",
            type: "text",
            defaultValue: selectedElement.title || ""
          },
          {
            id: "description",
            name: "description",
            label: "\u5206\u7EC4\u63CF\u8FF0",
            type: "text",
            defaultValue: selectedElement.description || ""
          }
        ]
      };
    }
    if (selectedElement.nodeType === "grid") {
      return {
        elements: [
          ...commonFields,
          {
            id: "columns",
            name: "columns",
            label: "\u7F51\u683C\u5217\u6570 (1-4)",
            type: "number",
            defaultValue: selectedElement.columns || 2,
            validations: [
              { type: "min", value: 1, message: "\u5217\u6570\u4E0D\u80FD\u5C0F\u4E8E1" },
              { type: "max", value: 4, message: "\u5217\u6570\u4E0D\u80FD\u5927\u4E8E4" }
            ]
          }
        ]
      };
    }
    if (selectedElement.nodeType === "list") {
      return {
        elements: [
          ...commonFields,
          {
            id: "title",
            name: "title",
            label: "\u5217\u8868\u5BB9\u5668\u540D\u79F0",
            type: "text",
            defaultValue: selectedElement.title || "",
            validations: [{ type: "required" }]
          },
          {
            id: "name",
            name: "name",
            label: "\u6570\u636E\u7ED1\u5B9A\u6807\u8BC6 (Name)",
            type: "text",
            defaultValue: selectedElement.name || "",
            validations: [{ type: "required" }]
          },
          {
            id: "description",
            name: "description",
            label: "\u5217\u8868\u8F85\u52A9\u63CF\u8FF0",
            type: "text",
            defaultValue: selectedElement.description || ""
          }
        ]
      };
    }
    const field = selectedElement;
    return {
      elements: [
        ...commonFields,
        {
          id: "label",
          name: "label",
          label: "\u5B57\u6BB5\u663E\u793A\u540D\u79F0",
          type: "text",
          defaultValue: field.label || "",
          validations: [{ type: "required" }]
        },
        {
          id: "name",
          name: "name",
          label: "\u5B57\u6BB5\u6807\u8BC6 (Name)",
          type: "text",
          defaultValue: field.name || "",
          validations: [{ type: "required" }]
        },
        {
          id: "placeholder",
          name: "placeholder",
          label: "\u8F93\u5165\u6846\u5360\u4F4D\u7B26",
          type: "text",
          defaultValue: field.placeholder || ""
        },
        {
          id: "required",
          name: "required",
          label: "\u662F\u5426\u4E3A\u5FC5\u586B\u9879",
          type: "switch",
          defaultValue: !!field.validations?.find((validation) => validation.type === "required")
        },
        {
          id: "hidden",
          name: "hidden",
          label: "\u52A8\u6001\u9690\u85CF\u6761\u4EF6 (\u8868\u8FBE\u5F0F)",
          type: "text",
          placeholder: "\u5982: $values.age > 18",
          defaultValue: typeof field.hidden === "string" ? field.hidden : ""
        },
        {
          id: "disabled",
          name: "disabled",
          label: "\u52A8\u6001\u7981\u7528\u6761\u4EF6 (\u8868\u8FBE\u5F0F)",
          type: "text",
          placeholder: '\u5982: $values.gender === "female"',
          defaultValue: typeof field.disabled === "string" ? field.disabled : ""
        }
      ]
    };
  }, [selectedElement?.id, selectedElement?.nodeType]);
  const form = useForm({ schema: propertySchema });
  useEffect(() => {
    if (!selectedElement) return;
    let timer;
    const unsubscribe = form.engine.store.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const state = form.engine.store.getState();
        const currentVals = state.values;
        if (currentVals && Object.keys(currentVals).length > 0) {
          const updates = {};
          if (selectedElement.nodeType === "group") {
            updates.title = currentVals.title;
            updates.description = currentVals.description;
          } else if (selectedElement.nodeType === "grid") {
            updates.columns = Number(currentVals.columns) || 2;
          } else if (selectedElement.nodeType === "list") {
            updates.title = currentVals.title;
            updates.name = currentVals.name;
            updates.description = currentVals.description;
          } else {
            updates.label = currentVals.label;
            updates.name = currentVals.name;
            updates.placeholder = currentVals.placeholder;
            if (currentVals.required) {
              updates.validations = [{ type: "required" }];
            } else {
              updates.validations = [];
            }
            if (currentVals.hidden) {
              updates.hidden = currentVals.hidden;
            } else {
              updates.hidden = false;
            }
            if (currentVals.disabled) {
              updates.disabled = currentVals.disabled;
            } else {
              updates.disabled = false;
            }
          }
          updateElement(selectedElement.id, updates);
        }
      }, 300);
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [form.engine.store, selectedElement?.id, selectedElement?.nodeType, updateElement]);
  const handleAddChildField = (type) => {
    if (!selectedElement) return;
    const childId = `field_${Date.now()}`;
    const newChild = {
      nodeType: "field",
      id: childId,
      name: `subfield_${Date.now()}`,
      label: type === "text" ? "\u5B50\u6587\u672C\u5B57\u6BB5" : "\u5B50\u6570\u5B57\u5B57\u6BB5",
      type
    };
    addChildElement(selectedElement.id, newChild);
  };
  if (!selectedElement) {
    return /* @__PURE__ */ jsx3("div", { className: "w-80 border-l border-slate-200 bg-slate-50 p-4 text-slate-400 text-sm text-center pt-20 flex-shrink-0", children: "\u8BF7\u5148\u5728\u753B\u5E03\u4E2D\u9009\u4E2D\u4E00\u4E2A\u7EC4\u4EF6\u914D\u7F6E\u5C5E\u6027" });
  }
  return /* @__PURE__ */ jsxs3("div", { className: "w-80 border-l border-slate-200 bg-white flex flex-col h-full flex-shrink-0", children: [
    /* @__PURE__ */ jsxs3("div", { className: "p-4 border-b border-slate-100 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("h2", { className: "font-semibold text-slate-800", children: "\u5C5E\u6027\u914D\u7F6E" }),
        /* @__PURE__ */ jsxs3("span", { className: "text-[10px] text-slate-400 font-mono", children: [
          "\u7C7B\u578B: ",
          selectedElement.nodeType || "field"
        ] })
      ] }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: () => removeElement(selectedElement.id),
          className: "text-red-500 hover:text-red-600 text-sm font-medium",
          children: "\u5220\u9664\u7EC4\u4EF6"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "flex-1 overflow-y-auto flex flex-col justify-between", children: [
      /* @__PURE__ */ jsx3("div", { className: "p-4", children: /* @__PURE__ */ jsx3(
        DynamicForm2,
        {
          form,
          schema: propertySchema,
          onSubmit: () => {
          },
          hideSubmitButton: true
        }
      ) }),
      (selectedElement.nodeType === "group" || selectedElement.nodeType === "grid" || selectedElement.nodeType === "list") && /* @__PURE__ */ jsxs3("div", { className: "border-t border-slate-100 bg-slate-50/50 p-4 pb-6", children: [
        /* @__PURE__ */ jsx3("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxs3("h3", { className: "font-semibold text-xs text-slate-800 tracking-wide uppercase", children: [
          "\u5B50\u5B57\u6BB5\u7BA1\u7406 (",
          selectedElement.elements?.length || 0,
          ")"
        ] }) }),
        /* @__PURE__ */ jsxs3("div", { className: "space-y-2 mb-4 max-h-40 overflow-y-auto pr-1", children: [
          (selectedElement.elements || []).map((child, idx) => /* @__PURE__ */ jsxs3(
            "div",
            {
              onClick: () => selectElement(child.id),
              className: "flex items-center justify-between p-2 bg-white border border-slate-200 rounded text-xs hover:border-blue-400 cursor-pointer shadow-sm transition-all",
              children: [
                /* @__PURE__ */ jsxs3("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx3("span", { className: "font-medium text-slate-700", children: child.label || child.name }),
                  /* @__PURE__ */ jsxs3("span", { className: "text-[10px] text-slate-400 font-mono", children: [
                    child.type,
                    " | ",
                    child.name
                  ] })
                ] }),
                /* @__PURE__ */ jsx3(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      removeElement(child.id);
                    },
                    className: "text-red-500 hover:text-red-600 font-medium text-[10px]",
                    children: "\u5220\u9664"
                  }
                )
              ]
            },
            child.id || idx
          )),
          (selectedElement.elements || []).length === 0 && /* @__PURE__ */ jsx3("p", { className: "text-[11px] text-slate-400 text-center py-4 bg-white border border-dashed border-slate-200 rounded", children: "\u5F53\u524D\u5BB9\u5668\u6682\u65E0\u5B50\u5B57\u6BB5\uFF0C\u8BF7\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u6DFB\u52A0" })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx3(
            "button",
            {
              type: "button",
              onClick: () => handleAddChildField("text"),
              className: "flex-1 py-1.5 border border-dashed border-slate-200 hover:border-slate-300 rounded text-xs font-semibold text-slate-600 hover:text-slate-700 bg-white transition-all shadow-sm flex items-center justify-center",
              children: "+ \u6587\u672C\u5B57\u6BB5"
            }
          ),
          /* @__PURE__ */ jsx3(
            "button",
            {
              type: "button",
              onClick: () => handleAddChildField("number"),
              className: "flex-1 py-1.5 border border-dashed border-slate-200 hover:border-slate-300 rounded text-xs font-semibold text-slate-600 hover:text-slate-700 bg-white transition-all shadow-sm flex items-center justify-center",
              children: "+ \u6570\u5B57\u5B57\u6BB5"
            }
          )
        ] })
      ] })
    ] })
  ] });
}

// src/index.tsx
import { DynamicForm as DynamicForm3 } from "pdyform-react";
import { Code2, Sparkles, Copy, Check, X, FileJson, Laptop } from "lucide-react";
import { Fragment, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function FormBuilder() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const addElement = useBuilderStore((s) => s.addElement);
  const moveElement = useBuilderStore((s) => s.moveElement);
  const selectElement = useBuilderStore((s) => s.selectElement);
  const [activeData, setActiveData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const handleDragStart = (event) => {
    const current = event.active.data.current;
    if (current?.isTemplate) {
      setActiveData({
        isTemplate: true,
        type: current.type,
        label: current.label,
        isLayout: current.isLayout
      });
      return;
    }
    if (current?.isElement) {
      setActiveData({
        isElement: true,
        element: current.element
      });
      return;
    }
    setActiveData(null);
  };
  const handleDragEnd = (event) => {
    setActiveData(null);
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.isTemplate) {
      const template = active.data.current;
      const id = `${template.type}_${Date.now()}`;
      let newElement;
      if (template.type === "list") {
        newElement = {
          nodeType: "list",
          id,
          name: `list_${Date.now()}`,
          title: "\u52A8\u6001\u8054\u7CFB\u4EBA\u5217\u8868",
          description: "\u53EF\u4EE5\u5728\u6B64\u5217\u8868\u5BB9\u5668\u4E2D\u914D\u7F6E\u91CD\u590D\u7684\u5B50\u8868\u5355\u884C",
          defaultValue: [{}],
          // Prepopulate with one empty row so that it renders beautifully in design view
          elements: [
            {
              nodeType: "field",
              id: `field_name_${Date.now()}`,
              name: "name",
              label: "\u59D3\u540D",
              type: "text",
              placeholder: "\u8BF7\u8F93\u5165\u59D3\u540D"
            },
            {
              nodeType: "field",
              id: `field_phone_${Date.now()}`,
              name: "phone",
              label: "\u7535\u8BDD\u53F7\u7801",
              type: "number",
              placeholder: "\u8BF7\u8F93\u5165\u8054\u7CFB\u7535\u8BDD"
            }
          ]
        };
      } else if (template.type === "group") {
        newElement = {
          nodeType: "group",
          id,
          title: "\u5206\u7EC4\u5361\u7247",
          description: "\u5305\u542B\u76F8\u5173\u8054\u5B57\u6BB5\u7684\u5361\u7247\u9762\u677F",
          elements: [
            {
              nodeType: "field",
              id: `field_title_${Date.now()}`,
              name: "title",
              label: "\u6807\u9898",
              type: "text"
            }
          ]
        };
      } else if (template.type === "grid") {
        newElement = {
          nodeType: "grid",
          id,
          columns: 2,
          elements: [
            {
              nodeType: "field",
              id: `field_col1_${Date.now()}`,
              name: "col1",
              label: "\u5DE6\u4FA7\u5217",
              type: "text"
            },
            {
              nodeType: "field",
              id: `field_col2_${Date.now()}`,
              name: "col2",
              label: "\u53F3\u4FA7\u5217",
              type: "text"
            }
          ]
        };
      } else {
        newElement = {
          nodeType: "field",
          id,
          name: `field_${Date.now()}`,
          type: template.type,
          label: template.label
        };
      }
      addElement(newElement);
      selectElement(newElement.id);
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
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2e3);
  };
  return /* @__PURE__ */ jsx4(DndContext, { collisionDetection: closestCenter, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: /* @__PURE__ */ jsxs4("div", { className: "flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsxs4("header", { className: "h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20 shadow-sm shrink-0", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx4("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20", children: /* @__PURE__ */ jsx4(Laptop, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx4("span", { className: "font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent", children: "pdyform Designer" }),
            /* @__PURE__ */ jsxs4("span", { className: "text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx4(Sparkles, { className: "w-2.5 h-2.5" }),
              " Industrial Grade"
            ] })
          ] }),
          /* @__PURE__ */ jsx4("p", { className: "text-[10px] text-slate-400", children: "\u914D\u7F6E\u5F0F\u3001\u5B89\u5168\u6C99\u7BB1\u8868\u8FBE\u5F0F\u8BC4\u4F30\u3001\u6DF1\u5C42\u52A8\u6001\u8868\u683C monorepo \u751F\u6210\u5668" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: () => setIsPreviewOpen(true),
            className: "px-4 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx4(FileJson, { className: "w-3.5 h-3.5 text-slate-500" }),
              "\u67E5\u770B Schema"
            ]
          }
        ),
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: () => setIsExportOpen(true),
            className: "px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/10 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx4(Code2, { className: "w-3.5 h-3.5" }),
              "\u5BFC\u51FA\u914D\u7F6E\u4EE3\u7801"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "flex-1 flex overflow-hidden", children: [
      /* @__PURE__ */ jsx4(Sidebar, {}),
      /* @__PURE__ */ jsx4(Canvas, {}),
      /* @__PURE__ */ jsx4(PropertyPanel, {})
    ] }),
    /* @__PURE__ */ jsxs4(DragOverlay, { children: [
      activeData && "isTemplate" in activeData ? /* @__PURE__ */ jsxs4("div", { className: "p-3 bg-white border-2 border-blue-500 rounded-lg shadow-lg flex items-center justify-between opacity-95 cursor-grabbing w-56", children: [
        /* @__PURE__ */ jsx4("span", { className: "text-sm font-medium text-slate-700", children: activeData.label }),
        activeData.isLayout && /* @__PURE__ */ jsx4("span", { className: "text-[9px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded", children: "\u5BB9\u5668" })
      ] }) : null,
      activeData && "isElement" in activeData ? /* @__PURE__ */ jsx4("div", { className: "p-4 bg-white border-2 border-blue-500 rounded-lg shadow-lg opacity-95 cursor-grabbing w-[500px]", children: /* @__PURE__ */ jsx4("div", { className: "pointer-events-none", children: /* @__PURE__ */ jsx4(DynamicForm3, { schema: { elements: [activeData.element] }, onSubmit: () => {
      }, hideSubmitButton: true }) }) }) : null
    ] }),
    (isPreviewOpen || isExportOpen) && /* @__PURE__ */ jsx4("div", { className: "fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[2px] transition-all duration-300", children: /* @__PURE__ */ jsxs4("div", { className: "w-[580px] h-full bg-white shadow-2xl flex flex-col animate-slide-in relative border-l border-slate-100", children: [
      /* @__PURE__ */ jsxs4("div", { className: "p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0", children: [
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsxs4("h3", { className: "font-bold text-base text-slate-800 flex items-center gap-2", children: [
            isPreviewOpen ? /* @__PURE__ */ jsx4(FileJson, { className: "w-5 h-5 text-blue-500" }) : /* @__PURE__ */ jsx4(Code2, { className: "w-5 h-5 text-indigo-500" }),
            isPreviewOpen ? "Form Schema (JSON)" : "\u5BFC\u51FA\u8868\u5355\u914D\u7F6E\u4EE3\u7801"
          ] }),
          /* @__PURE__ */ jsx4("p", { className: "text-xs text-slate-400 mt-1", children: isPreviewOpen ? "\u76F4\u63A5\u5C06\u6B64\u914D\u7F6E\u5BF9\u8C61\u4F20\u7ED9 DynamicForm \u7684 schema \u5C5E\u6027\u5373\u53EF\u76F4\u63A5\u6E32\u67D3\u3002" : "\u914D\u7F6E\u652F\u6301 Rule AST \u8868\u8FBE\u5F0F\uFF0C\u65E0 eval/new Function \u6267\u884C\u98CE\u9669\u3002" })
        ] }),
        /* @__PURE__ */ jsx4(
          "button",
          {
            onClick: () => {
              setIsPreviewOpen(false);
              setIsExportOpen(false);
            },
            className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors",
            children: /* @__PURE__ */ jsx4(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx4("div", { className: "flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-slate-300 relative select-all leading-relaxed custom-scrollbar", children: /* @__PURE__ */ jsx4("pre", { className: "overflow-x-auto whitespace-pre-wrap break-all select-all selection:bg-blue-600/30", children: JSON.stringify(schema, null, 2) }) }),
      /* @__PURE__ */ jsxs4("div", { className: "p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0", children: [
        /* @__PURE__ */ jsx4(
          "button",
          {
            onClick: () => {
              setIsPreviewOpen(false);
              setIsExportOpen(false);
            },
            className: "px-4 py-2 border border-slate-200 hover:bg-white rounded-lg text-xs font-semibold text-slate-600 transition-colors",
            children: "\u53D6\u6D88"
          }
        ),
        /* @__PURE__ */ jsx4(
          "button",
          {
            onClick: () => copyToClipboard(JSON.stringify(schema, null, 2)),
            className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-md shadow-blue-500/10 active:scale-95",
            children: copySuccess ? /* @__PURE__ */ jsxs4(Fragment, { children: [
              /* @__PURE__ */ jsx4(Check, { className: "w-3.5 h-3.5" }),
              "\u5DF2\u6210\u529F\u590D\u5236!"
            ] }) : /* @__PURE__ */ jsxs4(Fragment, { children: [
              /* @__PURE__ */ jsx4(Copy, { className: "w-3.5 h-3.5" }),
              "\u590D\u5236 Schema"
            ] })
          }
        )
      ] })
    ] }) })
  ] }) });
}
export {
  FormBuilder
};
