import { ref, onUnmounted, computed } from 'vue';
import { createFormEngine, get } from 'pdyform-core';
import type { FormSchema, FormRuntimeState } from 'pdyform-core';

export interface UseFormOptions {
  schema: FormSchema;
}

export function useForm({ schema }: UseFormOptions) {
  const engine = createFormEngine(schema.fields, schema.resolver, schema.errorMessages);
  const formState = ref<FormRuntimeState>(engine.store.getState());

  const unsubscribe = engine.store.subscribe((state: FormRuntimeState) => {
    formState.value = state;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const setValue = async (name: string, value: any) => {
    await engine.setFieldValue(name, value);
  };

  const getValue = (name: string) => {
    return get(formState.value.values, name);
  };

  const validate = async () => {
    const { hasError, state } = await engine.runSubmitValidation();
    return { hasError, values: state.values };
  };

  const reset = () => {
    engine.store.setState({
      values: {},
      errors: {},
      isSubmitting: false,
    });
  };

  return {
    engine,
    state: formState, // This is a Ref
    setValue,
    getValue,
    validate,
    reset,
  };
}

export type UseFormReturn = ReturnType<typeof useForm>;
