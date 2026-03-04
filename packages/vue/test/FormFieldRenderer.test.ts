// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FormFieldRenderer from '../src/FormFieldRenderer.vue';
import type { FormField } from 'pdyform/core';

describe('FormFieldRenderer', () => {
  const defaultField: FormField = {
    name: 'testField',
    label: 'Test Label',
    type: 'text',
    id: 'test-field-id',
  };

  it('renders a text input correctly', async () => {
    const wrapper = mount(FormFieldRenderer, {
      props: { field: defaultField, modelValue: 'test value' }
    });
    
    expect(wrapper.find('label').text()).toBe('Test Label');
    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('test value');
    expect((input.element as HTMLInputElement).type).toBe('text');
    
    await input.setValue('new value');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value']);
  });

  it('renders a textarea correctly', async () => {
    const field: FormField = { ...defaultField, type: 'textarea' };
    const wrapper = mount(FormFieldRenderer, {
      props: { field, modelValue: 'text\narea' }
    });
    
    const textarea = wrapper.find('textarea');
    expect((textarea.element as HTMLTextAreaElement).value).toBe('text\narea');
    
    await textarea.setValue('new textarea value');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new textarea value']);
  });

  it('renders a select correctly', async () => {
    const field: FormField = { 
      ...defaultField, 
      type: 'select', 
      options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' }
      ]
    };
    const wrapper = mount(FormFieldRenderer, {
      props: { field, modelValue: 'opt1' }
    });
    
    // Radix Select renders a combobox trigger
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true);

    // Simulate the SelectField emitting the new value (Radix portal doesn't fully function in jsdom)
    const selectField = wrapper.findComponent({ name: 'Select' });
    await selectField.vm.$emit('update:modelValue', 'opt2');
    
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['opt2']);
  });

  it('renders a checkbox correctly', async () => {
    const field: FormField = { 
      ...defaultField, 
      type: 'checkbox', 
      options: [
        { label: 'Check 1', value: 'c1' },
        { label: 'Check 2', value: 'c2' }
      ]
    };
    const wrapper = mount(FormFieldRenderer, {
      props: { field, modelValue: ['c1'] }
    });
    
    const checkboxes = wrapper.findAll('[role="checkbox"]');
    expect(checkboxes[0].attributes('data-state')).toBe('checked');
    expect(checkboxes[1].attributes('data-state')).toBe('unchecked');
    
    // Emit from the internal CheckboxComponent logic since Radix click simulation can be tricky with simple DOM wrapper
    const checkboxComponents = wrapper.findAllComponents({ name: 'Checkbox' });
    await checkboxComponents[1].vm.$emit('update:checked', true);

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['c1', 'c2']]);
  });

  it('renders a radio correctly', async () => {
    const field: FormField = { 
      ...defaultField, 
      type: 'radio', 
      options: [
        { label: 'Radio 1', value: 'r1' },
        { label: 'Radio 2', value: 'r2' }
      ]
    };
    const wrapper = mount(FormFieldRenderer, {
      props: { field, modelValue: 'r1' }
    });
    
    const radios = wrapper.findAll('[role="radio"]');
    expect(radios[0].attributes('data-state')).toBe('checked');
    expect(radios[1].attributes('data-state')).toBe('unchecked');
    
    // Radix Vue uses a radio group component wrapper for selecting
    const radioGroupComp = wrapper.findComponent({ name: 'RadioGroup' });
    await radioGroupComp.vm.$emit('update:modelValue', 'r2');
    
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['r2']);
  });

  it('displays description and error', () => {
    const field: FormField = { ...defaultField, description: 'Desc text' };
    const wrapper = mount(FormFieldRenderer, {
      props: { field, modelValue: '', error: 'Error text' }
    });
    
    expect(wrapper.text()).toContain('Desc text');
    expect(wrapper.text()).toContain('Error text');
  });
});
