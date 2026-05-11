import { jsx as _jsx } from "react/jsx-runtime";
import { Textarea } from './Textarea';
const TextareaRenderer = ({ field, value, onChange, onBlur, fieldId }) => (_jsx(Textarea, { id: fieldId, placeholder: field.placeholder, value: value ?? '', onChange: (e) => onChange(e.target.value), onBlur: onBlur, disabled: typeof field.disabled === 'boolean' ? field.disabled : undefined, name: field.name, ...field.componentProps }));
export default TextareaRenderer;
