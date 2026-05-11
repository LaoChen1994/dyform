import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from './Input';
const DateRenderer = ({ field, value, onChange, onBlur, fieldId, ariaInvalid, ariaRequired, ariaDescribedBy, }) => {
    return (_jsx(Input, { id: fieldId, type: "date", value: value ?? '', onChange: (e) => onChange(e.target.value), onBlur: onBlur, disabled: typeof field.disabled === 'boolean' ? field.disabled : undefined, name: field.name, "aria-invalid": ariaInvalid, "aria-required": ariaRequired, "aria-describedby": ariaDescribedBy, ...field.componentProps }));
};
export default DateRenderer;
