import { reactive, watchEffect } from 'vue'
import * as Y from 'yjs'
import { bindAny } from './bindAny'
import type { UnwrapRef } from 'vue'

export function bindObject({ vue = reactive({}), yjs = new Y.Map() }: {
  vue?: UnwrapRef<Record<string, any>>
  yjs?: Y.Map<any>
}) {
  if (yjs.keys().next().done) {
    Object.keys(vue).forEach(key => yjs.set(key, bindAny((vue as any)[key]).yjs))
  } else {
    yjs.forEach((value, key) => vue[key] = bindAny(value).vue)
  }

  let origin = ''
  watchEffect(() => Object.keys(vue).map(key => vue[key]), {
    onTrigger: event => {
      if (origin === 'yjs') {
        origin = ''
        return
      }
      origin = 'vue'
      switch (event.type) {
        case 'set':
        case 'add':
          yjs.set(event.key, bindAny(event.newValue).yjs)
          break
        case 'delete':
        case 'clear':
          yjs.delete(event.key)
          break
      }
    },
  })

  yjs.observe(event => {
    if (origin === 'vue') {
      origin = ''
      return
    }
    event.changes.keys.forEach((value, key) => {
      origin = 'yjs'
      switch (value.action) {
        case 'delete':
          delete vue[key]
          break
        case 'add':
        case 'update':
          vue[key] = bindAny(yjs.get(key)).vue
          break
      }
    })
  })

  return {
    vue,
    yjs,
  }
}
