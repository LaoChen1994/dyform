<script setup lang="ts">
import type { FormElement, FormField, FormGrid, FormGroup, FormList, FormRuntimeState } from 'pdyform-core';
import { get } from 'pdyform-core';
import FormFieldRenderer from './FormFieldRenderer.vue';
import type { UseFormReturn } from './useForm';

const props = withDefaults(defineProps<{
  elements: FormElement[];
  formState: FormRuntimeState;
  form: UseFormReturn;
  parentPath?: string;
}>(), {
  parentPath: ''
});

const emit = defineEmits<{
  change: [name: string, value: unknown];
  blur: [name: string];
}>();

const isGroupElement = (element: FormElement): element is FormGroup => element.nodeType === 'group';

const isGridElement = (element: FormElement): element is FormGrid => element.nodeType === 'grid';

const isListElement = (element: FormElement): element is FormList => element.nodeType === 'list';

const isFieldElement = (element: FormElement): element is FormField =>
  !isGroupElement(element) && !isGridElement(element) && !isListElement(element);

const getElementKey = (element: FormElement, index: number) => {
  return element.id || (isFieldElement(element) ? element.name : `el-${index}`);
};

const isFieldHidden = (field: FormField, formState: FormRuntimeState, fullFieldName: string) => {
  const computed = formState.computedStates?.[fullFieldName];
  return computed ? computed.hidden : (typeof field.hidden === 'function' ? field.hidden(formState.values) : !!field.hidden);
};

const getFieldWithDisabled = (field: FormField, formState: FormRuntimeState, fullFieldName: string) => {
  const computed = formState.computedStates?.[fullFieldName];
  const isDisabled = computed ? computed.disabled : (typeof field.disabled === 'function' ? field.disabled(formState.values) : !!field.disabled);
  const isValidating = formState.validatingFields.includes(fullFieldName);
  return { ...field, name: fullFieldName, disabled: isDisabled || isValidating };
};

const getGridStyle = (grid: FormGrid) => {
  return { gridTemplateColumns: `repeat(${grid.columns || 2}, minmax(0, 1fr))` };
};

const getFullFieldName = (element: FormField | FormList) => {
  return props.parentPath ? `${props.parentPath}.${element.name}` : element.name;
};

const getListValue = (list: FormList) => {
  const listPath = getFullFieldName(list);
  return (props.form.getValue(listPath) as unknown[]) || [];
};

const getRowPath = (list: FormList, index: number) => {
  const listPath = getFullFieldName(list);
  return `${listPath}[${index}]`;
};
</script>

<template>
  <template v-for="(element, index) in elements" :key="getElementKey(element, index)">
    <!-- Group Element -->
    <div
      v-if="isGroupElement(element)"
      :class="['space-y-4 p-4 border rounded-md', element.className]"
    >
      <div v-if="element.title || element.description" class="space-y-1">
        <h3 v-if="element.title" class="font-semibold text-lg tracking-tight text-slate-800">
          {{ element.title }}
        </h3>
        <p v-if="element.description" class="text-sm text-muted-foreground">
          {{ element.description }}
        </p>
      </div>
      <div class="space-y-4">
        <FormElementRenderer
          :elements="element.elements"
          :form-state="formState"
          :form="form"
          :parent-path="parentPath"
          @change="(name: string, value: unknown) => emit('change', name, value)"
          @blur="emit('blur', $event)"
        />
      </div>
    </div>

    <!-- Grid Element -->
    <div
      v-else-if="isGridElement(element)"
      :class="['grid gap-4', element.className]"
      :style="getGridStyle(element)"
    >
      <FormElementRenderer
        :elements="element.elements"
        :form-state="formState"
        :form="form"
        :parent-path="parentPath"
        @change="(name: string, value: unknown) => emit('change', name, value)"
        @blur="emit('blur', $event)"
      />
    </div>

    <!-- List Element -->
    <div
      v-else-if="isListElement(element)"
      :class="['space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50/50', element.className]"
    >
      <div v-if="element.title || element.description" class="space-y-1 border-b border-slate-100 pb-2 flex justify-between items-center">
        <div>
          <h3 v-if="element.title" class="font-semibold text-base tracking-tight text-slate-800">
            {{ element.title }}
          </h3>
          <p v-if="element.description" class="text-xs text-muted-foreground">
            {{ element.description }}
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="(_, rowIndex) in getListValue(element)"
          :key="`${getElementKey(element, index)}-${rowIndex}`"
          class="p-4 border border-slate-100 bg-white rounded-md relative shadow-sm space-y-4"
        >
          <div class="flex justify-between items-center border-b border-slate-50 pb-2">
            <span class="text-xs font-semibold text-slate-500">第 {{ rowIndex + 1 }} 项</span>
            <button
              type="button"
              @click="form.removeListItem(element.name, rowIndex)"
              class="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              删除
            </button>
          </div>
          <div class="space-y-4">
            <FormElementRenderer
              :elements="element.elements"
              :form-state="formState"
              :form="form"
              :parent-path="getRowPath(element, rowIndex)"
              @change="(name: string, value: unknown) => emit('change', name, value)"
              @blur="emit('blur', $event)"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="form.appendListItem(element.name, {})"
        class="w-full py-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 bg-white transition-all flex justify-center items-center gap-1 shadow-sm"
      >
        + 添加项
      </button>
    </div>

    <!-- Standard Field Element -->
    <FormFieldRenderer
      v-else-if="isFieldElement(element) && !isFieldHidden(element, formState, getFullFieldName(element))"
      :field="getFieldWithDisabled(element, formState, getFullFieldName(element))"
      :model-value="get(formState.values, getFullFieldName(element))"
      :error="formState.touched[getFullFieldName(element)] ? formState.errors[getFullFieldName(element)] : undefined"
      @update:model-value="emit('change', getFullFieldName(element), $event)"
      @blur="emit('blur', getFullFieldName(element))"
    />
  </template>
</template>
