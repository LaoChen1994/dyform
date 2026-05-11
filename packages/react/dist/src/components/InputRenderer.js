import { jsx as _jsx } from "react/jsx-runtime";
import { normalizeFieldValue } from 'pdyform-core';
import { Input } from './Input';
const InputRenderer = ({ field, value, onChange, onBlur, fieldId, ariaInvalid, ariaRequired, ariaDescribedBy, }) => {
    const handleChange = (nextValue) => {
        onChange(normalizeFieldValue(field, nextValue));
    };
    return (_jsx(Input, { id: fieldId, type: field.type, placeholder: field.placeholder, value: value ?? '', onChange: (e) => handleChange(e.target.value), onBlur: onBlur, disabled: typeof field.disabled === 'boolean' ? field.disabled : undefined, name: field.name, "aria-invalid": ariaInvalid, "aria-required": ariaRequired, "aria-describedby": ariaDescribedBy, ...field.componentProps }));
};
export default InputRenderer;
