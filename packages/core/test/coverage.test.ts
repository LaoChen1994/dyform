import { expect, test, describe } from 'vitest';
import { createFormEngine } from '../src/formState';

describe('Coverage edge cases', () => {
  test('handles exceptions in setFieldValue and setFieldBlur', async () => {
    const fields = [
      {
        id: '1',
        name: 'throwField',
        label: 'Throw Field',
        type: 'text' as const,
        validations: [{ type: 'custom' as const, validator: async () => { throw new Error('Validation crashed'); } }]
      },
      {
        id: '2',
        name: 'throwSelect',
        label: 'Throw Select',
        type: 'select' as const,
        options: [{ label: '1', value: '1' }],
        validations: [{ type: 'custom' as const, validator: async () => { throw new Error('Validation crashed'); } }]
      }
    ];

    const engine = createFormEngine(fields);

    await engine.setFieldValue('throwSelect', '1');
    expect(engine.store.getState().validatingFields).not.toContain('throwSelect');

    await engine.setFieldValue('throwField', 'val');
    await engine.setFieldBlur('throwField');
    expect(engine.store.getState().validatingFields).not.toContain('throwField');
  });

  test('handles pattern validation', async () => {
    const fields = [
      {
        id: '1',
        name: 'code',
        label: 'Code',
        type: 'text' as const,
        validations: [{ type: 'pattern' as const, value: '^[A-Z]+$', message: 'Must be uppercase' }]
      }
    ];

    const engine = createFormEngine(fields);
    await engine.setFieldValue('code', 'abc');
    await engine.setFieldBlur('code');
    expect(engine.store.getState().errors.code).toBe('Must be uppercase');

    await engine.setFieldValue('code', 'ABC');
    await engine.setFieldBlur('code');
    expect(engine.store.getState().errors.code).toBe('');
  });

  test('handles global resolver', async () => {
    const fields = [{ id: '1', name: 'fieldA', label: 'Field A', type: 'text' as const }];
    const resolver = async (values: any) => {
      if (values.fieldA === 'invalid') return { fieldA: 'Resolver error' };
      return {} as Record<string, string>;
    };

    const engine = createFormEngine(fields, resolver);
    
    await engine.setFieldValue('fieldA', 'invalid');
    await engine.setFieldBlur('fieldA');
    expect(engine.store.getState().errors.fieldA).toBe('Resolver error');
    
    await engine.setFieldValue('fieldA', 'valid');
    await engine.setFieldBlur('fieldA');
    expect(engine.store.getState().errors.fieldA).toBe('');
  });
});
