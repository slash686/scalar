<script setup lang="ts">
import Form from '@/components/Form/Form.vue'
import { useWorkspace } from '@/store'
import { useActiveEntities } from '@/store/active-entities'
import type { Server } from '@scalar/oas-utils/entities/spec'
import { computed } from 'vue'

const props = defineProps<{
  serverUid: string | string[]
  collectionId: string | string[]
}>()

const { activeWorkspaceCollections } = useActiveEntities()
const { servers, serverMutators } = useWorkspace()

const options = [
  { label: 'URL', key: 'url', placeholder: 'https://void.scalar.com/api' },
  {
    label: 'Label',
    key: 'description',
    placeholder: 'Production',
  },
]

const activeServer = computed(() => {
  const collection = activeWorkspaceCollections.value.find(
    (col) => col.uid === props.collectionId,
  )
  return servers[
    collection &&
    typeof props.serverUid === 'string' &&
    props.serverUid === 'default'
      ? collection.servers[0]
      : (collection?.servers.find((uid) => uid === props.serverUid) ?? '')
  ]
})

const updateServer = (key: string, value: string) => {
  if (!activeWorkspaceCollections.value) return
  serverMutators.edit(activeServer.value.uid, key as keyof Server, value)
}

const updateVariable = (key: string, value: any) => {
  if (!activeWorkspaceCollections.value) return
  serverMutators.edit(activeServer.value.uid, `variables.${key}.value`, value)
}

/** Fields for the table */
const variableOptions = computed(() =>
  Object.entries(activeServer.value?.variables ?? {}).map(
    ([key, variable]) => ({
      key,
      label: key,
      placeholder: (variable.default ?? variable?.enum?.[0] ?? '').toString(),
    }),
  ),
)

/** Values from the workspace, use `default` or `enum[0]` as fallback */
const variablesData = computed(() =>
  Object.entries(activeServer.value.variables ?? {}).reduce<
    Record<string, string>
  >((acc, [key, variable]) => {
    acc[key] = (variable.default ?? variable?.enum?.[0] ?? '').toString()
    return acc
  }, {}),
)
</script>
<template>
  <div class="divide-0.5 divide-x flex w-full">
    <template v-if="activeServer">
      <Form
        :data="activeServer"
        :onUpdate="updateServer"
        :options="options"
        title="Server" />

      <Form
        v-if="Object.keys(variablesData).length"
        :data="variablesData"
        :onUpdate="updateVariable"
        :options="variableOptions"
        title="Variables" />
    </template>
  </div>
</template>
