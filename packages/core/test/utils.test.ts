import { describe, it, expect } from 'vitest';
import { 
  get, 
  set, 
  validateField, 
  validateForm
} from '../src/utils';
import { FormField } from '../src/types';

describe('core utils - get / set', () => {
  it('gets nested values correctly', () => {
    const obj = { a: { b: { c: 1 } }, d: [10, 20] };
    expect(get(obj, 'a.b.c')).toBe(1);
    expect(get(obj, 'd[1]')).toBe(20);
    expect(get(obj, 'non.existent', 'default')).toBe('default');
  });

  it('sets nested values immutably', () => {
    const obj = { a: { b: 1 } };
    const newObj = set(obj, 'a.c', 2);
    
    expect(newObj).toEqual({ a: { b: 1, c: 2 } });
    expect(obj).toEqual({ a: { b: 1 } }); // Original unchanged
    expect(newObj.a).not.toBe(obj.a); // Reference changed
  });

  it('creates intermediate objects/arrays when setting', () => {
    const obj = {};
    const newObj = set(obj, 'users[0].name', 'Alice');
    expect(newObj).toEqual({ users: [{ name: 'Alice' }] });
    expect(Array.isArray(newObj.users)).toBe(true);
  });
});

describe('core utils - validateField (async)', () => {
  it('returns null if there are no validations', async () => {
    const field: FormField = { id: '1', name: 'f1', label: 'Field 1', type: 'text' };
    expect(await validateField('any value', field)).toBeNull();
  });

  describe('required', () => {
    const field: FormField = { id: '1', name: 'f1', label: 'Field 1', type: 'text', validations: [{ type: 'required', message: 'req' }] };
    
    it('fails on undefined, null, empty string, or empty array', async () => {
      expect(await validateField(undefined, field)).toBe('req');
      expect(await validateField(null, field)).toBe('req');
      expect(await validateField('', field)).toBe('req');
      expect(await validateField([], field)).toBe('req');
    });
  });

  describe('custom async', () => {
    it('supports async validators', async () => {
      const field: FormField = { 
        id: '1', name: 'c', label: 'C', type: 'text', 
        validations: [{ 
          type: 'custom', 
          validator: async (val) => {
            await new Promise(r => setTimeout(r, 10));
            return val === 'magic' ? true : 'Not magic';
          } 
        }] 
      };

      expect(await validateField('test', field)).toBe('Not magic');
      expect(await validateField('magic', field)).toBeNull();
    });
  });
});

describe('core utils - validateForm with Resolver', () => {
  const fields: FormField[] = [
    { id: '1', name: 'username', label: 'Username', type: 'text' },
  ];

  it('uses resolver for validation', async () => {
    const resolver = async (values: any) => {
      if (!values.username) return { username: 'Resolver Error' };
      return {};
    };

    const errors = await validateForm(fields, { username: '' }, resolver);
    expect(errors.username).toBe('Resolver Error');
  });

  it('merges resolver and field-level errors', async () => {
    const fieldsWithVal: FormField[] = [
      { id: '1', name: 'f1', label: 'F1', type: 'text', validations: [{ type: 'required', message: 'F1 Req' }] },
      { id: '2', name: 'f2', label: 'F2', type: 'text' },
    ];
    const resolver = async () => ({ f2: 'F2 Error' });

    const errors = await validateForm(fieldsWithVal, { f1: '', f2: '' }, resolver);
    expect(errors).toEqual({
      f1: 'F1 Req',
      f2: 'F2 Error'
    });
  });
});
