import { describe, it, expect } from 'vitest';
import { createFormEngine } from '../src/formState';
import type { FormSchema } from '../src/types';

describe('FormList Nested Structures & Shifting Mutations', () => {
  const schema: FormSchema = {
    title: 'Nested Form Test',
    elements: [
      {
        nodeType: 'field',
        id: 'owner',
        name: 'owner',
        label: 'Owner Name',
        type: 'text',
        defaultValue: 'Bob',
      },
      {
        nodeType: 'list',
        id: 'contacts',
        name: 'contacts',
        elements: [
          {
            nodeType: 'field',
            id: 'name',
            name: 'name',
            label: 'Contact Name',
            type: 'text',
            defaultValue: 'New Contact',
            validations: [{ type: 'required', message: 'Contact name is required' }],
          },
          {
            nodeType: 'field',
            id: 'phone',
            name: 'phone',
            label: 'Phone',
            type: 'text',
            defaultValue: '',
            hidden: '$values.contacts[0].name === "Secret"', // String expression support
          }
        ],
      },
    ],
  };

  it('initializes schema with empty list values', () => {
    const engine = createFormEngine(schema);
    const state = engine.store.getState();

    expect(state.values.owner).toBe('Bob');
    expect(state.values.contacts).toEqual([]);
    expect(state.computedStates['owner']).toEqual({ hidden: false, disabled: false });
  });

  it('handles appendListItem mutation and dynamic flattening', async () => {
    const engine = createFormEngine(schema);
    
    // Append first item
    engine.appendListItem('contacts', { name: 'Alice', phone: '123' });
    let state = engine.store.getState();

    expect(state.values.contacts).toEqual([{ name: 'Alice', phone: '123' }]);
    
    // Check computedStates automatically populated for the dynamically flattened fields
    expect(state.computedStates['contacts[0].name']).toEqual({ hidden: false, disabled: false });
    expect(state.computedStates['contacts[0].phone']).toEqual({ hidden: false, disabled: false });

    // Set field value directly on nested dynamic path
    await engine.setFieldValue('contacts[0].name', 'Bob');
    state = engine.store.getState();
    expect(state.values.contacts).toEqual([{ name: 'Bob', phone: '123' }]);
  });

  it('runs validation on nested dynamically-expanded paths', async () => {
    const engine = createFormEngine(schema);
    
    // Append an item with missing required name
    engine.appendListItem('contacts', { name: '', phone: '123' });
    
    // Trigger submit validation
    const result = await engine.runSubmitValidation();
    expect(result.hasError).toBe(true);
    expect(result.state.errors['contacts[0].name']).toBe('Contact name is required');
  });

  it('evaluates string expressions inside nested fields', async () => {
    const engine = createFormEngine(schema);
    
    // Append item
    engine.appendListItem('contacts', { name: 'Alice', phone: '123' });
    let state = engine.store.getState();
    expect(state.computedStates['contacts[0].phone']).toEqual({ hidden: false, disabled: false });

    // Set name to "Secret" which triggers the hidden expression on contacts[0].phone
    await engine.setFieldValue('contacts[0].name', 'Secret');
    state = engine.store.getState();
    expect(state.computedStates['contacts[0].phone']).toEqual({ hidden: true, disabled: false });
  });

  it('performs clean removeListItem mutation and indexes state shifting', async () => {
    const engine = createFormEngine(schema);
    
    // Add three items
    engine.appendListItem('contacts', { name: 'Item 0', phone: '000' });
    engine.appendListItem('contacts', { name: 'Item 1', phone: '111' });
    engine.appendListItem('contacts', { name: 'Item 2', phone: '222' });

    // Inject errors and touched values to simulate user interactions
    engine.store.setState((prev) => ({
      errors: {
        'contacts[0].name': 'Error 0',
        'contacts[1].name': 'Error 1',
        'contacts[2].name': 'Error 2',
      },
      touched: {
        'contacts[0].name': true,
        'contacts[1].name': true,
        'contacts[2].name': true,
      }
    }));

    let state = engine.store.getState();
    expect(state.values.contacts).toHaveLength(3);

    // Remove item at index 1 ("Item 1")
    engine.removeListItem('contacts', 1);
    state = engine.store.getState();

    // Verify values shifted correctly
    expect(state.values.contacts).toEqual([
      { name: 'Item 0', phone: '000' },
      { name: 'Item 2', phone: '222' }, // Item 2 shifted to index 1
    ]);

    // Verify errors shifted correctly and item 1's error was removed
    expect(state.errors).toEqual({
      'contacts[0].name': 'Error 0',
      'contacts[1].name': 'Error 2', // Former item 2 error migrated to index 1
    });

    // Verify touched shifted correctly
    expect(state.touched).toEqual({
      'contacts[0].name': true,
      'contacts[1].name': true, // Migrated
    });
  });
});
