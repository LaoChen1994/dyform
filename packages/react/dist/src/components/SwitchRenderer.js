import { jsx as _jsx } from "react/jsx-runtime";
import { Switch } from './Switch';
const SwitchRenderer = ({ field, value, onChange, fieldId, ariaInvalid, ariaRequired, ariaDescribedBy, }) => {
    return (_jsx("div", { className: "flex items-center space-x-2", children: _jsx(Switch, { id: fieldId, checked: !!value, onCheckedChange: onChange, disabled: typeof field.disabled === 'boolean' ? field.disabled : undefined, name: field.name, "aria-invalid": ariaInvalid, "aria-required": ariaRequired, "aria-describedby": ariaDescribedBy, ...field.componentProps }) }));
};
export default SwitchRenderer;
