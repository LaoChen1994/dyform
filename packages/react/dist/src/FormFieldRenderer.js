import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Label, defaultComponentMap, InputRenderer } from './components';
export const FormFieldRenderer = ({ field, value, onChange, onBlur, error, componentMap, }) => {
    const { label, description, name, type, validations } = field;
    const fieldId = `field-${name}`;
    const descriptionId = `${fieldId}-description`;
    const errorId = `${fieldId}-error`;
    const isRequired = validations?.some((v) => v.type === 'required');
    const resolvedMap = componentMap
        ? { ...defaultComponentMap, ...componentMap }
        : defaultComponentMap;
    const FieldComponent = resolvedMap[type] ?? InputRenderer;
    // Combine multiple IDs into one string for aria-describedby
    const describedBy = [
        description ? descriptionId : null,
        error ? errorId : null,
    ].filter(Boolean).join(' ');
    const layout = field.layout || 'vertical';
    return (_jsxs("div", { className: `${layout === 'horizontal' ? 'flex flex-row items-center gap-4' : 'space-y-2'} ${field.className || ''}`, children: [label && layout !== 'none' && (_jsxs(Label, { htmlFor: fieldId, className: isRequired ? "flex items-center gap-1 shrink-0" : "shrink-0", children: [label, isRequired && _jsx("span", { className: "text-destructive", children: "*" })] })), _jsxs("div", { className: layout === 'horizontal' ? 'flex-1 space-y-2' : 'space-y-2', children: [_jsx(FieldComponent, { field: field, value: value, onChange: onChange, onBlur: onBlur, fieldId: fieldId, errorId: errorId, descriptionId: descriptionId, ariaInvalid: !!error, ariaRequired: isRequired, ariaDescribedBy: describedBy || undefined }), description && (_jsx("p", { id: descriptionId, className: "text-[0.8rem] text-muted-foreground", children: description })), error && (_jsx("p", { id: errorId, className: "text-[0.8rem] font-medium text-destructive", children: error }))] })] }));
};
