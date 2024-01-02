import * as Y from 'yjs'
import { ref } from 'vue'
import { toYjs } from './bindAny'

export function useHistory(value: any) {
  const manager = new Y.UndoManager(toYjs(value))
  const canUndo = ref(false)
  const canRedo = ref(false)

  function onHistory() {
    canUndo.value = manager.canUndo()
    canRedo.value = manager.canRedo()
  }

  manager.on('stack-item-added', onHistory)
  manager.on('stack-item-updated', onHistory)
  manager.on('stack-item-popped', onHistory)
  manager.on('stack-cleared', onHistory)

  return {
    manager,
    canUndo,
    canRedo,
    undo: () => manager.undo(),
    redo: () => manager.redo(),
    stopCapturing: () => manager.stopCapturing(),
    reset: (undo?: boolean, redo?: boolean) => manager.clear(undo, redo),
  }
}
