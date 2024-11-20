<script setup lang="ts">
import DataTableInput from '@/components/DataTable/DataTableInput.vue'
import type { EnvVariables } from '@/libs/env-helpers'
import type { Environment } from '@scalar/oas-utils/entities/environment'
import type { Router } from 'vue-router'

const props = withDefaults(
  defineProps<{
    id: string
    type?: string
    environment: Environment
    envVariables: EnvVariables
    containerClass?: string
    required?: boolean
    modelValue: string | number
    readOnly?: boolean
    router?: Router
  }>(),
  { required: false, readOnly: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'inputFocus'): void
  (e: 'inputBlur'): void
  (e: 'selectVariable', value: string): void
}>()
</script>
<template>
  <DataTableInput
    :id="props.id"
    :canAddCustomEnumValue="!props.readOnly"
    :containerClass="props.containerClass"
    :envVariables="props.envVariables"
    :environment="props.environment"
    :modelValue="props.modelValue"
    :readOnly="props.readOnly"
    :required="props.required"
    :router="props.router"
    :type="props.type"
    v-bind="$attrs"
    @inputBlur="emit('inputBlur')"
    @inputFocus="emit('inputFocus')"
    @selectVariable="emit('selectVariable', $event)"
    @update:modelValue="emit('update:modelValue', $event)">
    <template #default>
      <label :for="props.id">
        <slot />
      </label>
    </template>
    <template #icon>
      <slot name="icon" />
    </template>
  </DataTableInput>
</template>
