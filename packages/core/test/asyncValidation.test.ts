import { expect, test, describe } from 'vitest';
import { createFormEngine } from '../src/formState';

describe('Async Validation', () => {
  test('handles slow async validation correctly and tracks validatingFields', async () => {
    const fields = [
      {
        id: '1',
        name: 'username',
        label: 'Username',
        type: 'text' as const,
        validations: [
          {
            type: 'custom' as const,
            validator: async (val: unknown) => {
              await new Promise(r => setTimeout(r, 50));
              return val === 'admin' ? 'Username already taken' : true;
            }
          }
        ]
      }
    ];

    const engine = createFormEngine(fields);
    
    await engine.setFieldValue('username', 'admin');
    const validationPromise = engine.setFieldBlur('username');
    
    expect(engine.store.getState().validatingFields).toContain('username');
    expect(engine.store.getState().errors.username).toBeUndefined();
    
    await validationPromise;
    
    expect(engine.store.getState().validatingFields).not.toContain('username');
    expect(engine.store.getState().errors.username).toBe('Username already taken');
  });

  test('runSubmitValidation prevents submission if async validation fails', async () => {
    const fields = [
      {
        id: '1',
        name: 'asyncField',
        label: 'Async Field',
        type: 'text' as const,
        defaultValue: 'invalid',
        validations: [
          {
            type: 'custom' as const,
            validator: async (val: unknown) => {
              await new Promise(r => setTimeout(r, 10));
              return val === 'valid' ? true : 'Invalid value';
            }
          }
        ]
      }
    ];

    const engine = createFormEngine(fields);
    
    const submitPromise = engine.runSubmitValidation();
    expect(engine.store.getState().isSubmitting).toBe(true);

    const result = await submitPromise;
    expect(engine.store.getState().isSubmitting).toBe(false);
    expect(result.hasError).toBe(true);
    expect(result.state.errors.asyncField).toBe('Invalid value');
  });
});
