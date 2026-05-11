import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FieldItem } from './FieldItem';
export const FormElementRenderer = ({ elements, form, componentMap }) => {
    return (_jsx(_Fragment, { children: elements.map((el, index) => {
            const key = el.id || ('name' in el ? el.name : `el-${index}`);
            if (el.nodeType === 'group') {
                const group = el;
                return (_jsxs("div", { className: `space-y-4 p-4 border rounded-md ${group.className || ''}`, children: [(group.title || group.description) && (_jsxs("div", { className: "space-y-1", children: [group.title && _jsx("h3", { className: "font-semibold text-lg tracking-tight", children: group.title }), group.description && _jsx("p", { className: "text-sm text-muted-foreground", children: group.description })] })), _jsx("div", { className: "space-y-4", children: _jsx(FormElementRenderer, { elements: group.elements, form: form, componentMap: componentMap }) })] }, key));
            }
            if (el.nodeType === 'grid') {
                const grid = el;
                const cols = grid.columns || 2;
                return (_jsx("div", { className: `grid gap-4 ${grid.className || ''}`, style: { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }, children: _jsx(FormElementRenderer, { elements: grid.elements, form: form, componentMap: componentMap }) }, key));
            }
            // By default, treat as FormField
            return (_jsx(FieldItem, { field: el, form: form, componentMap: componentMap }, key));
        }) }));
};
