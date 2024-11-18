import { createModalRouter } from '@/router'
import { createWorkspaceStore } from '@/store/store'
import { workspaceSchema } from '@scalar/oas-utils/entities/workspace'
import { describe, expect, it } from 'vitest'

describe('store', () => {
  describe('createWorkspaceStore', () => {
    it('creates a store', () => {
      const store = createWorkspaceStore(createModalRouter(), {
        useLocalStorage: false,
        defaultProxyUrl: 'https://proxy.scalar.com',
      })

      // Check all the basic entities are there
      expect(store).toBeDefined()
      expect(store.workspaces).toBeDefined()
      expect(store.collections).toBeDefined()
      expect(store.requests).toBeDefined()
      expect(store.environments).toBeDefined()
      expect(store.servers).toBeDefined()
      expect(store.securitySchemes).toBeDefined()
      expect(store.tags).toBeDefined()
      expect(store.cookies).toBeDefined()
      expect(store.requestExamples).toBeDefined()

      // Check default proxy URL is set
      expect(store.proxyUrl.value).toBe('https://proxy.scalar.com')

      // Check store has required methods
      expect(store.importSpecFile).toBeInstanceOf(Function)
      expect(store.importSpecFromUrl).toBeInstanceOf(Function)
      expect(store.setProxyUrl).toBeInstanceOf(Function)
    })

    it('imports an OpenAPI document', async () => {
      // OpenAPI document
      const definition = {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {
          '/foobar': {
            get: {
              operationId: 'getFoobar',
              summary: 'Get Foobar',
              responses: {
                '200': {
                  description: 'Successful response',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          message: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      // Store
      const store = createWorkspaceStore(createModalRouter(), {
        useLocalStorage: false,
        defaultProxyUrl: 'https://proxy.scalar.com',
      })

      const { activeWorkspace, importSpecFile } = store

      // Workspace
      const workspace = workspaceSchema.parse({
        uid: 'default',
        name: 'Workspace',
        isReadOnly: true,
        proxyUrl: 'https://proxy.scalar.com',
      })

      store.workspaceMutators.rawAdd(workspace)

      // Import
      await importSpecFile(definition, activeWorkspace.value.uid)

      // Check collections were created
      expect(Object.keys(store.collections).length).toBe(1)
      expect(store.activeWorkspaceCollections.value?.length).toBe(1)

      // Check requests were created
      expect(Object.keys(store.requests).length).toBe(1)
      expect(store.activeWorkspaceRequests.value?.length).toBe(1)

      // Check request details
      const request = Object.values(store.requests)[0]
      expect(request.method).toBe('get')
      expect(request.path).toBe('/foobar')
      expect(request.summary).toBe('Get Foobar')
      expect(request.operationId).toBe('getFoobar')
    })
  })
})
