import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from './Checkbox';
import { Label } from './Label';
const CheckboxRenderer = ({ field, value, onChange, onBlur }) => (_jsx("div", { className: "flex flex-wrap gap-4", children: field.options?.map((opt) => {
        const checked = Array.isArray(value) && value.includes(opt.value);
        return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `checkbox-${field.name}-${opt.value}`, checked: checked, disabled: typeof field.disabled === 'boolean' ? field.disabled : undefined, onCheckedChange: (c) => {
                        const next = Array.isArray(value) ? [...value] : [];
                        if (c) {
                            next.push(opt.value);
                        }
                        else {
                            const idx = next.indexOf(opt.value);
                            if (idx > -1)
                                next.splice(idx, 1);
                        }
                        onChange(next);
                    }, onBlur: onBlur, ...field.componentProps }), _jsx(Label, { htmlFor: `checkbox-${field.name}-${opt.value}`, className: "font-normal", children: opt.label })] }, opt.value));
    }) }));
export default CheckboxRenderer;
