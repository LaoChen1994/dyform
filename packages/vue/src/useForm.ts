import { ref, onUnmounted, computed } from 'vue';
import { createFormStore, get } from 'pdyform-core';
import type { FormSchema, FormStore } from 'pdyform-core';

export interface UseFormOptions {
  schema: FormSchema;
}

export function useForm({ schema }: UseFormOptions) {
  const store = createFormStore(schema.fields, schema.resolver, schema.errorMessages);
  const formState = ref<FormStore>(store.getState());

  const unsubscribe = store.subscribe((state) => {
    formState.value = state;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const setValue = async (name: string, value: any) => {
    await store.getState().setFieldValue(name, value);
  };

  const getValue = (name: string) => {
    return get(formState.value.values, name);
  };

  const validate = async () => {
    const { hasError, state } = await store.getState().runSubmitValidation();
    return { hasError, values: state.values };
  };

  const reset = () => {
    store.setState({
      values: {},
      errors: {},
      isSubmitting: false,
    });
  };

  return {
    store,
    state: formState, // This is a Ref
    setValue,
    getValue,
    validate,
    reset,
  };
}

export type UseFormReturn = ReturnType<typeof useForm>;
