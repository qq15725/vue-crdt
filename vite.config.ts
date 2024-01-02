import { basename, resolve } from 'path'
import { defineConfig } from 'vite'
import { exports, module } from './package.json'

const resolvePath = (str: string) => resolve(__dirname, str)

export default defineConfig({
  build: {
    lib: {
      entry: resolvePath('./src/index.ts'),
    },
    rollupOptions: {
      external: ['vue', 'yjs'],
      output: [
        {
          format: 'es',
          entryFileNames: basename(module),
        },
        {
          format: 'cjs',
          entryFileNames: basename(exports['.'].require),
        },
      ],
    },
  },
})
