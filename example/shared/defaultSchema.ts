import type { FormSchema } from 'pdyform/core';

export const defaultSchema: FormSchema = {
  title: 'Comprehensive Registration Form',
  description: 'This form demonstrates conditional logic, nested data, and async validation.',
  submitButtonText: 'Register Now',
  fields: [
    {
      id: 'username',
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Check availability (try "admin")',
      validations: [
        { type: 'required', message: 'Username is required' },
        {
          type: 'custom',
          validator: async (val: any) => {
            if (!val) return true;
            await new Promise((r) => setTimeout(r, 800)); // Simulate API call
            return val === 'admin' ? 'This username is already taken' : true;
          },
        },
      ],
    },
    {
      id: 'role',
      name: 'role',
      label: 'Primary Role',
      type: 'radio',
      defaultValue: 'developer',
      options: [
        { label: 'Developer', value: 'developer' },
        { label: 'Designer', value: 'designer' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'otherRole',
      name: 'otherRole',
      label: 'Please specify your role',
      type: 'text',
      hidden: (values: any) => values.role !== 'other',
      validations: [{ type: 'required', message: 'Please specify your role' }],
    },
    {
      id: 'address_city',
      name: 'address.city',
      label: 'City (Nested Path)',
      type: 'text',
      placeholder: 'e.g. San Francisco',
    },
    {
      id: 'address_street',
      name: 'address.street',
      label: 'Street',
      type: 'text',
      placeholder: '123 Main St',
      hidden: (values: any) => !values.address?.city,
    },
    {
      id: 'isFullTime',
      name: 'isFullTime',
      label: 'Full-time Position',
      type: 'switch',
      defaultValue: true,
    },
    {
      id: 'startDate',
      name: 'startDate',
      label: 'Expected Start Date',
      type: 'date',
      hidden: (values: any) => !values.isFullTime,
    },
    {
      id: 'bio',
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about your experience',
      validations: [{ type: 'max', value: 200, message: 'Max 200 characters' }],
    },
  ],
};
