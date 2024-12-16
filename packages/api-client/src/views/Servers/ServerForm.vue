<script setup lang="ts">
import Form from '@/components/Form/Form.vue'
import { useWorkspace } from '@/store'
import { useActiveEntities } from '@/store/active-entities'
import ServerVariablesForm from '@/views/Servers/ServerVariablesForm.vue'
import type { Server } from '@scalar/oas-utils/entities/spec'
import { computed, withDefaults } from 'vue'

const props = withDefaults(
  defineProps<{
    collectionId: string | string[]
    serverUid: string | string[]
  }>(),
  {
    collectionId: '',
    serverUid: '',
  },
)

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

const updateVariable = (oldKey: string, newKey: string, value: any) => {
  if (!activeWorkspaceCollections.value) return
  if (newKey === '' && value === '') return

  const variables = { ...activeServer.value.variables }
  if (oldKey !== newKey) {
    delete variables[oldKey]
  }
  if (!variables[newKey]) {
    variables[newKey] = { default: value }
  } else {
    variables[newKey].default = value
  }

  serverMutators.edit(activeServer.value.uid, 'variables', variables)
}
</script>
<template>
  <div class="divide-0.5 divide-x flex w-full">
    <template v-if="activeServer">
      <Form
        :data="activeServer"
        :onUpdate="updateServer"
        :options="options"
        title="Server" />

      <ServerVariablesForm
        :server="activeServer"
        title="Variables"
        @updateVariable="updateVariable" />
    </template>
  </div>
</template>
