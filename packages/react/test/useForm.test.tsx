import { renderHook, act } from '@testing-library/react';
import { useForm } from '../src/useForm';
import { expect, test, describe } from 'vitest';

describe('useForm Hook', () => {
  test('initializes and updates state correctly using SyncExternalStore', async () => {
    const schema = {
      fields: [
        { id: '1', name: 'firstName', label: 'First Name', type: 'text' as const, defaultValue: 'Jane' }
      ]
    };

    const { result, unmount } = renderHook(() => useForm({ schema }));

    expect(result.current.state.values.firstName).toBe('Jane');
    
    await act(async () => {
      await result.current.setValue('firstName', 'John');
    });

    expect(result.current.state.values.firstName).toBe('John');
    expect(result.current.getValue('firstName')).toBe('John');
    
    await act(async () => {
      result.current.setError('firstName', 'Custom error');
    });
    
    expect(result.current.state.errors.firstName).toBe('Custom error');
    
    unmount();
  });

  test('validate and reset functions work correctly', async () => {
    const schema = {
      fields: [
        { 
            id: '1', name: 'email', label: 'Email', type: 'text' as const, 
            validations: [{ type: 'required' as const, message: 'Required' }] 
        }
      ]
    };

    const { result } = renderHook(() => useForm({ schema }));

    let validationResult;
    await act(async () => {
      validationResult = await result.current.validate();
    });

    expect(validationResult?.hasError).toBe(true);
    expect(result.current.state.errors.email).toBe('Required');

    act(() => {
        result.current.reset();
    });

    expect(result.current.state.errors.email).toBeUndefined();
  });
});
