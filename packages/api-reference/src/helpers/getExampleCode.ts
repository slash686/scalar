import {
  type ClientId as SnippetzClientId,
  type TargetId as SnippetzTargetId,
  snippetz,
} from '@scalar/snippetz'

import { convertRequestToHarRequest } from '../helpers/convertRequestToHarRequest'

export type TargetId = SnippetzTargetId
export type ClientId<T extends SnippetzTargetId> = SnippetzClientId<T>

/**
 * Returns a code example for given Request
 */
export async function getExampleCode<T extends SnippetzTargetId>(
  /** JS request object */
  request: Request,
  target: TargetId | string,
  client: ClientId<T> | string,
  /** The original path before variable replacement */
  originalPath?: string,
) {
  // Convert request to HarRequest
  const harRequest = await convertRequestToHarRequest(request)

  // Bring back the pathParameter variables in the URL
  if (originalPath) {
    const url = new URL(request.url)
    url.pathname = originalPath
    harRequest.url = decodeURIComponent(url.toString())
  }

  // TODO: Fix this, use js (instead of javascript) everywhere
  const snippetzTargetKey = target?.replace(
    'javascript',
    'js',
  ) as SnippetzTargetId

  if (snippetz().hasPlugin(snippetzTargetKey, client)) {
    return snippetz().print(
      snippetzTargetKey,
      client as SnippetzClientId<typeof target>,
      harRequest,
    )
  }

  // Prevent snippet generation if starting by a variable
  if (request.url.startsWith('__')) {
    return request.url
  }

  return ''
}
