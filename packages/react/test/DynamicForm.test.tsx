// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicForm } from '../src/DynamicForm';
import React from 'react';

// Mock ResizeObserver for Radix UI components in jsdom
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('React DynamicForm', () => {
  const schema: any = {
    fields: [
      { name: 'username', label: 'Username', type: 'text', validations: [{ type: 'required', message: 'Required' }] }
    ]
  };

  it('renders correctly', () => {
    render(<DynamicForm schema={schema} onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Username/i)).toBeTruthy();
  });

  it('shows validation error on blur', async () => {
    render(<DynamicForm schema={schema} onSubmit={() => {}} />);
    const input = screen.getByLabelText(/Username/i);
    fireEvent.blur(input);
    expect(await screen.findByText('Required')).toBeTruthy();
  });

  it('handles field visibility dynamically', async () => {
    const dynamicSchema: any = {
      fields: [
        { name: 'showSecret', label: 'Show Secret', type: 'checkbox', options: [{ label: 'Yes', value: 'yes' }] },
        { name: 'secretKey', label: 'Secret Key', type: 'text', hidden: (v: any) => !v.showSecret?.includes('yes') }
      ]
    };
    render(<DynamicForm schema={dynamicSchema} onSubmit={() => {}} />);
    
    // Initially hidden
    expect(screen.queryByLabelText(/Secret Key/i)).toBeNull();
    
    // Check the box
    const checkbox = screen.getByLabelText(/Yes/i);
    fireEvent.click(checkbox);
    
    // Should now be visible
    expect(await screen.findByLabelText(/Secret Key/i)).toBeTruthy();
  });
});
