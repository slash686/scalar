<script setup lang="ts">
import DataTable from '@/components/DataTable/DataTable.vue'
import DataTableInput from '@/components/DataTable/DataTableInput.vue'
import DataTableRow from '@/components/DataTable/DataTableRow.vue'
import ViewLayoutSection from '@/components/ViewLayout/ViewLayoutSection.vue'
import type { Server } from '@scalar/oas-utils/entities/spec'
import { computed, defineEmits, onMounted } from 'vue'

const props = defineProps<{
  title?: string
  server: Server
}>()

const emit = defineEmits<{
  (e: 'updateVariable', key: string, newKey: string, newValue?: string): void
}>()

const variablesData = computed(() => {
  const data = Object.entries(props.server?.variables ?? {}).reduce<
    Record<string, string>
  >((acc, [key, variable]) => {
    acc[key] = (variable.default ?? variable?.enum?.[0] ?? '').toString()
    return acc
  }, {})
  data[''] = ''
  return data
})

const variableOptions = computed(() => {
  const entries = Object.entries(props.server?.variables ?? {})
  return [
    ...entries.map(([key]) => ({
      key,
      label: key,
    })),
    { key: '', label: '' },
  ]
})

onMounted(() => {
  ensureDefaultRow()
})

const ensureDefaultRow = () => {
  if (Object.keys(variablesData.value).length === 0) {
    addRow()
  } else {
    const lastKey = Object.keys(variablesData.value).pop()
    if (lastKey && variablesData.value[lastKey] !== '') {
      addRow()
    }
  }
}

const addRow = () => {
  variablesData.value[''] = ''
}
</script>
<template>
  <ViewLayoutSection>
    <template #title>
      <span v-if="title">{{ title }}</span>
      <slot
        v-else
        name="title" />
    </template>
    <div class="custom-scroll flex flex-1 flex-col gap-1.5 p-2 md:p-5">
      <DataTable
        v-if="Object.keys(variablesData).length > 0"
        :columns="['', '']">
        <DataTableRow
          v-for="(option, index) in variableOptions"
          :key="index"
          :class="{ 'border-t': index === 0 }">
          <DataTableInput
            :modelValue="option.key"
            :placeholder="'Name'"
            @update:modelValue="
              (newKey) => emit('updateVariable', option.key, newKey)
            ">
          </DataTableInput>
          <DataTableInput
            :modelValue="String(variablesData[option.key] ?? '')"
            :placeholder="'Value'"
            @update:modelValue="
              (newValue) => {
                if (newValue === '' && option.key === '') {
                  delete variablesData[option.key]
                  if (Object.keys(variablesData.value).length === 0) {
                    addRow()
                  }
                } else {
                  emit('updateVariable', option.key, option.key, newValue)
                }
              }
            ">
          </DataTableInput>
        </DataTableRow>
      </DataTable>
    </div>
  </ViewLayoutSection>
</template>
