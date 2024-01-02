import * as Y from 'yjs'
import { bindAny } from './bindAny'

export function defineStore<T extends Record<string, any>>(setup: (doc: Y.Doc) => T): () => T {
  return () => {
    const doc = new Y.Doc()
    const result = setup(doc)
    if (result && typeof result === 'object') {
      for (const key in result) {
        bindAny(result[key], (type: any) => doc.get(key, type))
      }
    }
    return result as any
  }
}
