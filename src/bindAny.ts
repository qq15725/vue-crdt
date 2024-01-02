import { isReactive, isRef, toRaw } from 'vue'
import * as Y from 'yjs'
import { bindObject } from './bindObject'
import { bindArray } from './bindArray'
import { bindText } from './bindText'

const proxyMap = new WeakMap<any, any>()

export function toYjs(value: any) {
  return proxyMap.get(toRaw(value))
}

export function bindAny(
  value: any,
  getYAny?: (type: any) => any,
): any {
  const result = doBindAny(value, getYAny)
  const target = isRef(result.vue) ? result.vue.value : result.vue
  if (target && typeof target === 'object') {
    proxyMap.set(toRaw(target), result.yjs)
  }
  return result
}

function doBindAny(
  value: any,
  getYAny?: (type: any) => any,
) {
  if (value instanceof Y.Map) {
    return bindObject({ yjs: value })
  } else if (value instanceof Y.Array) {
    return bindArray({ yjs: value })
  } else if (isRef(value)) {
    switch (typeof value.value) {
      case 'number':
      case 'string':
        return bindText({ vue: value as any, yjs: getYAny?.(Y.Text) })
      default:
        return bindAny(value.value, getYAny)
    }
  } else if (isReactive(value)) {
    if (Array.isArray(value)) {
      return bindArray({ vue: value, yjs: getYAny?.(Y.Array) })
    } else {
      return bindObject({ vue: value, yjs: getYAny?.(Y.Map) })
    }
  }
  return { vue: value, yjs: value }
}
