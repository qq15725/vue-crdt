<h1 align="center">Vue CRDT</h1>

<p align="center">
  <a href="https://unpkg.com/vue-crdt">
    <img src="https://img.shields.io/bundlephobia/minzip/vue-crdt" alt="Minzip">
  </a>
  <a href="https://www.npmjs.com/package/vue-crdt">
    <img src="https://img.shields.io/npm/v/vue-crdt.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/vue-crdt">
    <img src="https://img.shields.io/npm/dm/vue-crdt" alt="Downloads">
  </a>
  <a href="https://github.com/qq15725/vue-crdt/issues">
    <img src="https://img.shields.io/github/issues/qq15725/vue-crdt" alt="Issues">
  </a>
  <a href="https://github.com/qq15725/vue-crdt/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/vue-crdt.svg" alt="License">
  </a>
</p>

## 📦 Install

```shell
npm i vue-crdt
```


## 🦄 Usage

```ts
import { reactive, ref } from 'vue'
import { defineStore, useHistory } from 'vue-crdt'

const useEditorStore = defineStore(doc => {
  // use y-webrtc
  //
  // new WebrtcProvider(
  //  'your-room-name',
  //  doc,
  //  { password: 'optional-room-password' },
  // )

  return {
    workspace: reactive({
      pages: { a: 'b' },
      activePage: null,
    }),
    width: ref(800),
    height: ref(600),
  }
})

const { workspace, width, height } = useEditorStore()

const history = useHistory(workspace)

workspace.activePage = 123
history.stopCapturing()
workspace.activePage = 456
history.undo()

console.log(workspace)
```
