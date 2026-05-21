// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { computed, defineComponent } from 'vue';
import DynamicForm from '../src/DynamicForm.vue';
import { useForm } from '../src/useForm';

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

  it('renders schema elements with group and grid containers', () => {
    const elementsSchema: any = {
      elements: [
        {
          nodeType: 'group',
          id: 'profile',
          title: 'Profile',
          elements: [
            {
              nodeType: 'grid',
              id: 'profile-grid',
              columns: 2,
              elements: [
                { id: 'firstName', name: 'firstName', label: 'First Name', type: 'text' },
                { id: 'lastName', name: 'lastName', label: 'Last Name', type: 'text' },
              ],
            },
          ],
        },
      ],
    };

    const wrapper = mount(DynamicForm, {
      props: { schema: elementsSchema }
    });

    expect(wrapper.text()).toContain('Profile');
    expect(wrapper.find('label[for="field-firstName"]').text()).toContain('First Name');
    expect(wrapper.find('label[for="field-lastName"]').text()).toContain('Last Name');
  });

  it('reset restores schema default values', async () => {
    const ResetHarness = defineComponent({
      setup() {
        const form = useForm({
          schema: {
            fields: [
              { id: 'username', name: 'username', label: 'Username', type: 'text', defaultValue: 'Jane' }
            ]
          }
        });
        const value = computed(() => form.state.value.values.username);

        return { form, value };
      },
      template: `
        <div>
          <span data-test="value">{{ value }}</span>
          <button data-test="change" @click="form.setValue('username', 'John')">change</button>
          <button data-test="reset" @click="form.reset()">reset</button>
        </div>
      `,
    });

    const wrapper = mount(ResetHarness);

    expect(wrapper.find('[data-test="value"]').text()).toBe('Jane');

    await wrapper.find('[data-test="change"]').trigger('click');
    await flushPromises();
    expect(wrapper.find('[data-test="value"]').text()).toBe('John');

    await wrapper.find('[data-test="reset"]').trigger('click');
    await flushPromises();
    expect(wrapper.find('[data-test="value"]').text()).toBe('Jane');
  });

  it('emits submit-error when submit handler throws', async () => {
    const submitError = new Error('submit failed');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(DynamicForm, {
        props: {
          schema: {
            fields: [
              { name: 'username', label: 'Username', type: 'text', defaultValue: 'testuser' }
            ]
          }
        },
        attrs: {
          onSubmit: () => {
            throw submitError;
          },
        },
      });

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.emitted('submit-error')?.[0]).toEqual([submitError]);
    } finally {
      warn.mockRestore();
    }
  });

  it('supports FormList and mutations', async () => {
    const listSchema: any = {
      elements: [
        {
          nodeType: 'list',
          name: 'contacts',
          title: 'Contacts',
          elements: [
            { id: 'name', name: 'name', label: 'Contact Name', type: 'text' }
          ]
        }
      ]
    };

    const wrapper = mount(DynamicForm, {
      props: { schema: listSchema }
    });

    expect(wrapper.text()).toContain('Contacts');
    // Initially should have 0 items (empty list)
    expect(wrapper.find('button[type="button"]').text()).toContain('+ 添加项');

    // Click "+ 添加项" to add a new contact row
    await wrapper.find('button[type="button"]').trigger('click');
    await flushPromises();

    // Now there should be one item
    expect(wrapper.text()).toContain('第 1 项');
    expect(wrapper.find('label[for="field-contacts[0].name"]').text()).toContain('Contact Name');

    // Input some value
    const input = wrapper.find('input[id="field-contacts[0].name"]');
    await input.setValue('Alice');
    await flushPromises();

    // Submit and check if values have contacts array
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')?.[0]).toEqual([{
      contacts: [{ name: 'Alice' }]
    }]);

    // Click "删除" (delete item)
    const deleteBtn = wrapper.findAll('button').find(btn => btn.text() === '删除');
    expect(deleteBtn).toBeDefined();
    await deleteBtn!.trigger('click');
    await flushPromises();

    // Check that there is no more Alice or Contact Name field
    expect(wrapper.text()).not.toContain('第 1 项');
  });
});
