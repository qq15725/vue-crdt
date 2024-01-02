import { ref, watchEffect } from 'vue'
import * as Y from 'yjs'
import type { Ref } from 'vue'

export function bindText({ vue = ref(''), yjs = new Y.Text() }: {
  vue?: Ref<string | number>
  yjs?: Y.Text
}) {
  let origin = ''
  const syncVueToYjs = () => {
    if (origin === 'yjs') {
      origin = ''
      return
    }
    origin = 'vue'
    if (yjs.length) {
      yjs.delete(0, yjs.length)
    }
    yjs.insert(0, String(vue.value))
  }

  const syncYjsToVue = () => {
    if (origin === 'vue') {
      origin = ''
      return
    }
    origin = 'yjs'
    vue.value = yjs.toJSON()
  }

  if (yjs.length) {
    syncYjsToVue()
  } else {
    // syncVueToYjs()
  }

  watchEffect(() => vue.value, {
    onTrigger: syncVueToYjs,
  })

  yjs.observe(syncYjsToVue)

  return {
    vue,
    yjs,
  }
}
