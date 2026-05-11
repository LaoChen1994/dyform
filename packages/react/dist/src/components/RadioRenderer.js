import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RadioGroup, RadioGroupItem } from './RadioGroup';
import { Label } from './Label';
const RadioRenderer = ({ field, value, onChange, onBlur }) => (_jsx(RadioGroup, { value: value != null ? String(value) : '', onValueChange: onChange, disabled: typeof field.disabled === 'boolean' ? field.disabled : undefined, name: field.name, className: "flex flex-wrap gap-4", ...field.componentProps, children: field.options?.map((opt) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: String(opt.value), id: `radio-${field.name}-${opt.value}`, onBlur: onBlur }), _jsx(Label, { htmlFor: `radio-${field.name}-${opt.value}`, className: "font-normal", children: opt.label })] }, opt.value))) }));
export default RadioRenderer;
