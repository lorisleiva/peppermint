import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      crypto: 'crypto-browserify',
    },
    dedupe: [
      '@bundlr-network/client',
      'tweetnacl',
      'brorand',
      '@metaplex-foundation/beet',
    ],
  },
  define: {
    'process.env': process.env ?? {},
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [
        nodePolyfills({ crypto: true }),
      ],
    },
  },
  optimizeDeps: {
    // exclude: ['@lorisleiva/js-next-alpha'],
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true }),
      ],
    }
  },
})
