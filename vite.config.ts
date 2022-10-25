import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), visualizer()],
  resolve: {
    alias: {
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      crypto: 'crypto-browserify',
      http: 'https-browserify',
      url: 'url',
    },
    dedupe: [
      '@bundlr-network/client',
      '@metaplex-foundation/beet',
      'bn.js',
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
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true }),
      ],
    }
  },
})
