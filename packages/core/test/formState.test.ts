import { describe, it, expect } from 'vitest';
import { createFormEngine } from '../src/formState';
import { FormField } from '../src/types';

describe('core formStore helpers', () => {
  const fields: FormField[] = [
    { id: '1', name: 'name', label: 'Name', type: 'text', validations: [{ type: 'required', message: 'Name is required' }] },
    { id: '2', name: 'age', label: 'Age', type: 'number', validations: [{ type: 'min', value: 18, message: 'Age must be at least 18' }] },
  ];

  it('creates initial runtime state', () => {
    const engine = createFormEngine(fields);
    const state = engine.store.getState();

    expect(state.values).toEqual({ name: '', age: '' });
    expect(state.errors).toEqual({});
    expect(state.isSubmitting).toBe(false);
  });

  it('sets submitting state', () => {
    const engine = createFormEngine(fields);
    engine.setSubmitting(true);
    expect(engine.store.getState().isSubmitting).toBe(true);
  });

  it('applies field change with normalization and inline validation', async () => {
    const engine = createFormEngine(fields);
    await engine.setFieldValue('age', '22');

    expect(engine.store.getState().values.age).toBe(22);
    expect(engine.store.getState().errors.age).toBeUndefined();
  });

  it('applies blur validation', async () => {
    const engine = createFormEngine(fields);
    await engine.setFieldBlur('name');

    expect(engine.store.getState().errors.name).toBe('Name is required');
  });

  it('runs submit validation and returns hasError flag', async () => {
    const engine = createFormEngine(fields);
    const result = await engine.runSubmitValidation();

    expect(result.hasError).toBe(true);
    expect(engine.store.getState().isSubmitting).toBe(false);
    expect(engine.store.getState().errors.name).toBe('Name is required');
  });

  it('handles field normalization (number)', async () => {
    const engine = createFormEngine(fields);
    await engine.setFieldValue('age', '25');
    expect(engine.store.getState().values.age).toBe(25);
  });
});
