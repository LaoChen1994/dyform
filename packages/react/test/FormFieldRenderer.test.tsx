// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormFieldRenderer } from '../src/FormFieldRenderer';
import React from 'react';
import type { FormField } from 'pdyform/core';

describe('FormFieldRenderer', () => {
  const defaultField: FormField = {
    name: 'testField',
    label: 'Test Label',
    type: 'text',
    id: 'test-field-id',
  };

  it('renders a text input correctly', () => {
    const onChange = vi.fn();
    render(<FormFieldRenderer field={defaultField} value="test value" onChange={onChange} />);
    
    expect(screen.getByLabelText('Test Label')).toBeTruthy();
    const input = screen.getByDisplayValue('test value') as HTMLInputElement;
    expect(input.type).toBe('text');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalledWith('new value');
  });

  it('renders a textarea correctly', () => {
    const field: FormField = { ...defaultField, type: 'textarea' };
    const onChange = vi.fn();
    render(<FormFieldRenderer field={field} value={"text\narea"} onChange={onChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('text\narea');
  });

  it('renders a select correctly', () => {
    const field: FormField = { 
      ...defaultField, 
      type: 'select', 
      options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' }
      ]
    };
    const onChange = vi.fn();
    render(<FormFieldRenderer field={field} value="opt1" onChange={onChange} />);
    
    // Radix Select Trigger is a button (combobox)
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('Option 1');
    
    // Open select to trigger change
    fireEvent.click(trigger);
    
    // Select Option 2
    const option2 = screen.getByRole('option', { name: 'Option 2' });
    fireEvent.click(option2);
    
    expect(onChange).toHaveBeenCalledWith('opt2');
  });

  it('renders a checkbox correctly', () => {
    const field: FormField = { 
      ...defaultField, 
      type: 'checkbox', 
      options: [
        { label: 'Check 1', value: 'c1' },
        { label: 'Check 2', value: 'c2' }
      ]
    };
    const onChange = vi.fn();
    render(<FormFieldRenderer field={field} value={['c1']} onChange={onChange} />);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Check 1' });
    const checkbox2 = screen.getByRole('checkbox', { name: 'Check 2' });
    
    expect(checkbox1.getAttribute('aria-checked')).toBe('true');
    expect(checkbox2.getAttribute('aria-checked')).toBe('false');
    
    fireEvent.click(checkbox2);
    expect(onChange).toHaveBeenCalledWith(['c1', 'c2']);
    
    fireEvent.click(checkbox1);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('renders a radio correctly', () => {
    const field: FormField = { 
      ...defaultField, 
      type: 'radio', 
      options: [
        { label: 'Radio 1', value: 'r1' },
        { label: 'Radio 2', value: 'r2' }
      ]
    };
    const onChange = vi.fn();
    render(<FormFieldRenderer field={field} value="r1" onChange={onChange} />);
    
    const radio1 = screen.getByRole('radio', { name: 'Radio 1' });
    const radio2 = screen.getByRole('radio', { name: 'Radio 2' });
    
    expect(radio1.getAttribute('aria-checked')).toBe('true');
    expect(radio2.getAttribute('aria-checked')).toBe('false');
    
    fireEvent.click(radio2);
    expect(onChange).toHaveBeenCalledWith('r2');
  });

  it('displays description and error', () => {
    const field: FormField = { ...defaultField, description: 'Desc text' };
    render(<FormFieldRenderer field={field} value="" onChange={() => {}} error="Error text" />);
    
    expect(screen.getByText('Desc text')).toBeTruthy();
    expect(screen.getByText('Error text')).toBeTruthy();
  });
});
