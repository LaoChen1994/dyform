<script setup lang="ts">
import { cn } from '../utils'

const props = defineProps<{
  class?: any
  type?: string
  modelValue?: any
}>()

const emit = defineEmits(['update:modelValue', 'blur'])
</script>

<template>
  <input
    :type="type"
    :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @blur="emit('blur', $event)"
  />
</template>
