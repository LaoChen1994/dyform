// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('applies runtime field props from schema effects', () => {
    const runtimeSchema: any = {
      fields: [
        { name: 'account', label: 'Account', type: 'text' }
      ],
      effects: (engine: any) => {
        engine.setFieldProps('account', {
          label: 'Runtime Account',
          placeholder: 'Runtime placeholder',
        });
      },
    };

    render(<DynamicForm schema={runtimeSchema} onSubmit={() => {}} />);

    expect(screen.getByLabelText(/Runtime Account/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Runtime placeholder/i)).toBeTruthy();
  });

  it('calls onSubmitError when submit handler throws', async () => {
    const submitError = new Error('submit failed');
    const onSubmitError = vi.fn();
    const validSchema: any = {
      fields: [
        { name: 'username', label: 'Username', type: 'text', defaultValue: 'testuser' }
      ]
    };

    render(
      <DynamicForm
        schema={validSchema}
        onSubmit={() => {
          throw submitError;
        }}
        onSubmitError={onSubmitError}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(onSubmitError).toHaveBeenCalledWith(submitError);
    });
  });
});
