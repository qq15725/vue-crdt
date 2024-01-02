<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { WebrtcProvider } from 'y-webrtc'
  import { defineStore, useHistory } from '../../src'

  // clients connected to the same room-name share document updates
  const useDocStore = defineStore(doc => {
    new WebrtcProvider(
      'your-room-name',
      doc,
      { password: 'optional-room-password' },
    )

    const workspace = reactive({
      pages: { a: 'b' },
      activePage: null,
    })
    const width = ref(0)
    const height = ref(0)
    const test2 = ref([])
    return { workspace, width, height, test2 }
  })

  const { workspace, width, height, test2 } = useDocStore()

  const { canUndo, canRedo, undo, redo, sync, reset } = useHistory(workspace)
</script>

<template>
  <div>
    <div>
      <div>{{ workspace.activePage }}</div>
      <input v-model="workspace.activePage">
      <div>
        <button :disabled="!canUndo" @click="undo()">undo</button>
        <button :disabled="!canRedo" @click="redo()">redo</button>
        <button @click="sync()">sync</button>
        <button @click="reset()">reset</button>
      </div>
    </div>
    <div>{{ width }}</div> <input v-model="width">
    <div>{{ height }}</div> <input v-model="height">
    <div>{{ test2 }}</div>
  </div>
</template>
