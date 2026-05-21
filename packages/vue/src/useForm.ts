import { ref, onUnmounted } from 'vue';
import { createFormEngine, get } from 'pdyform-core';
import type { FormSchema, FormRuntimeState } from 'pdyform-core';

export interface UseFormOptions {
  schema: FormSchema;
}

export function useForm({ schema }: UseFormOptions) {
  const engine = createFormEngine(schema, schema.resolver, schema.errorMessages);
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
    const { hasError, values } = await engine.runSubmitValidation();
    return { hasError, values };
  };

  const reset = () => {
    engine.resetForm();
  };

  const appendListItem = (name: string, defaultVal?: unknown) => {
    engine.appendListItem(name, defaultVal);
  };

  const removeListItem = (name: string, index: number) => {
    engine.removeListItem(name, index);
  };

  return {
    engine,
    state: formState, // This is a Ref
    setValue,
    getValue,
    validate,
    reset,
    appendListItem,
    removeListItem,
  };
}

export type UseFormReturn = ReturnType<typeof useForm>;
