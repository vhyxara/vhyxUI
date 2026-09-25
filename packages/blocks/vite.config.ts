import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

/** Same cascade-layer wrapping as @vhyxui/react (DECISION-UI-004). */
function layerComponentsCss(): Plugin {
  return {
    name: 'vhyxui-layer-components',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css') && typeof file.source === 'string') {
          file.source = `@layer theme,base,components,utilities;@layer components{${file.source}}`;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    layerComponentsCss(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        blocks: resolve(__dirname, 'src/blocks/index.ts'),
        layouts: resolve(__dirname, 'src/layouts/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@vhyxui\//, /^@vhyxseal\//],
      output: {
        banner: (chunk) => (chunk.isEntry ? "'use client';" : ''),
      },
    },
  },
});
