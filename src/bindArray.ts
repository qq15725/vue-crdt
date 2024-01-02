import { reactive, watchEffect } from 'vue'
import * as Y from 'yjs'
import { bindAny } from './bindAny'
import type { UnwrapRef } from 'vue'

export function bindArray({ vue = reactive([]), yjs = new Y.Array() }: {
  vue?: UnwrapRef<Array<any>>
  yjs?: Y.Array<any>
}) {
  if (yjs.length) {
    yjs.forEach(value => vue.push(bindAny(value).vue))
  } else {
    yjs.push(vue.map(value => bindAny(value).yjs))
  }

  let origin = ''
  watchEffect(() => vue.length, {
    onTrigger: event => {
      if (event.type !== 'add' && event.type !== 'delete') return
      if (origin === 'yjs') {
        origin = ''
        return
      }
      origin = 'vue'
      const index = Number(event.key)
      switch (event.type) {
        case 'add':
          yjs.insert(index, [bindAny(vue[index]).yjs])
          break
        case 'delete':
          yjs.delete(index, 1)
          break
      }
    },
  })

  yjs.observe(event => {
    if (origin === 'vue') {
      origin = ''
      return
    }
    origin = 'yjs'
    event.changes.delta.forEach(action => {
      const retain = action.retain ?? vue.length
      if (action.delete) {
        vue.splice(retain - 1, action.delete)
      }
      if (action.insert) {
        if (Array.isArray(action.insert)) {
          action.insert.forEach((item, index) => {
            vue.splice(retain + index, 0, bindAny(item).vue)
          })
        } else {
          vue.splice(retain, 0, bindAny(action.insert).vue)
        }
      }
    })
  })

  return {
    vue,
    yjs,
  }
}
