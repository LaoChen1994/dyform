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

  it('omits hidden field values from submit values when configured', async () => {
    const engine = createFormEngine({
      hiddenFieldStrategy: 'omit',
      fields: [
        { id: '1', name: 'type', label: 'Type', type: 'text', defaultValue: 'personal' },
        { id: '2', name: 'company', label: 'Company', type: 'text', defaultValue: 'ACME', hidden: (values) => values.type !== 'enterprise' },
      ],
    });

    const result = await engine.runSubmitValidation();

    expect(result.values).toEqual({ type: 'personal' });
    expect(engine.store.getState().values).toEqual({ type: 'personal', company: 'ACME' });
  });

  it('clears hidden field values from submit values when configured', async () => {
    const engine = createFormEngine({
      hiddenFieldStrategy: 'clear',
      fields: [
        { id: '1', name: 'type', label: 'Type', type: 'text', defaultValue: 'personal' },
        { id: '2', name: 'company', label: 'Company', type: 'text', defaultValue: 'ACME', hidden: (values) => values.type !== 'enterprise' },
      ],
    });

    const result = await engine.runSubmitValidation();

    expect(result.values).toEqual({ type: 'personal', company: '' });
    expect(engine.store.getState().values).toEqual({ type: 'personal', company: 'ACME' });
  });

  it('validates text fields on change when validateOn is change', async () => {
    const engine = createFormEngine({
      validateOn: 'change',
      fields: [
        { id: '1', name: 'name', label: 'Name', type: 'text', validations: [{ type: 'required', message: 'Name is required' }] },
      ],
    });

    await engine.setFieldValue('name', '');

    expect(engine.store.getState().errors.name).toBe('Name is required');
  });

  it('skips blur validation when validateOn is submit', async () => {
    const engine = createFormEngine({
      validateOn: 'submit',
      fields: [
        { id: '1', name: 'name', label: 'Name', type: 'text', validations: [{ type: 'required', message: 'Name is required' }] },
      ],
    });

    await engine.setFieldBlur('name');
    expect(engine.store.getState().errors.name).toBeUndefined();

    const result = await engine.runSubmitValidation();
    expect(result.hasError).toBe(true);
    expect(engine.store.getState().errors.name).toBe('Name is required');
  });
});
