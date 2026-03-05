import { describe, it, expect } from 'vitest';
import { createFormStore } from '../src/formState';
import { FormField } from '../src/types';

describe('core formStore helpers', () => {
  const fields: FormField[] = [
    { id: '1', name: 'name', label: 'Name', type: 'text', validations: [{ type: 'required', message: 'Name is required' }] },
    { id: '2', name: 'age', label: 'Age', type: 'number', validations: [{ type: 'min', value: 18, message: 'Age must be at least 18' }] },
  ];

  it('creates initial runtime state', () => {
    const store = createFormStore(fields);
    const state = store.getState();

    expect(state.values).toEqual({ name: '', age: '' });
    expect(state.errors).toEqual({});
    expect(state.isSubmitting).toBe(false);
  });

  it('sets submitting state', () => {
    const store = createFormStore(fields);
    store.getState().setSubmitting(true);
    expect(store.getState().isSubmitting).toBe(true);
  });

  it('applies field change with normalization and inline validation', async () => {
    const store = createFormStore(fields);
    await store.getState().setFieldValue('age', '22');

    expect(store.getState().values.age).toBe(22);
    expect(store.getState().errors.age).toBe('');
  });

  it('applies blur validation', async () => {
    const store = createFormStore(fields);
    await store.getState().setFieldBlur('name');

    expect(store.getState().errors.name).toBe('Name is required');
  });

  it('runs submit validation and returns hasError flag', async () => {
    const store = createFormStore(fields);
    const result = await store.getState().runSubmitValidation();

    expect(result.hasError).toBe(true);
    expect(store.getState().isSubmitting).toBe(false);
    expect(store.getState().errors.name).toBe('Name is required');
  });

  it('handles field normalization (number)', async () => {
    const store = createFormStore(fields);
    await store.getState().setFieldValue('age', '25');
    expect(store.getState().values.age).toBe(25);
  });
});
