// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DynamicForm from '../src/DynamicForm.vue';

describe('Vue DynamicForm', () => {
  const schema: any = {
    fields: [
      { name: 'username', label: 'Username', type: 'text', validations: [{ type: 'required', message: 'Required' }] }
    ]
  };

  it('renders correctly', () => {
    const wrapper = mount(DynamicForm, {
      props: { schema }
    });
    expect(wrapper.find('label').text()).toContain('Username');
  });

  it('shows validation error on blur', async () => {
    const wrapper = mount(DynamicForm, {
      props: { schema }
    });
    
    const input = wrapper.find('input');
    await input.trigger('blur');
    expect(wrapper.text()).toContain('Required');
  });

  it('emits submit event when valid', async () => {
    const wrapper = mount(DynamicForm, {
      props: { schema }
    });
    
    const input = wrapper.find('input');
    await input.setValue('testuser');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    
    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')?.[0]).toEqual([{ username: 'testuser' }]);
  });
});

