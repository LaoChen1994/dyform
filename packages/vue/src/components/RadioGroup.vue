<script setup lang="ts">
import { computed } from 'vue'
import { RadioGroupItem, type RadioGroupItemProps, RadioGroupRoot, type RadioGroupRootEmits, type RadioGroupRootProps, useForwardPropsEmits } from 'radix-vue'
import { Circle } from 'lucide-vue-next'
import { cn } from '../utils'

// Root
const props = defineProps<RadioGroupRootProps & { class?: any }>()
const emits = defineEmits<RadioGroupRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<script lang="ts">
export { default as RadioGroupItem } from './RadioGroupItem.vue'
</script>

<template>
  <RadioGroupRoot
    v-bind="forwarded"
    :class="cn('grid gap-2', props.class)"
  >
    <slot />
  </RadioGroupRoot>
</template>
