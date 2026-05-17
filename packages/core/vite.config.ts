import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
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
        index:     resolve(__dirname, 'src/index.ts'),
        contracts: resolve(__dirname, 'src/contracts/index.ts'),
        slot:      resolve(__dirname, 'src/slot/index.ts'),
        errors:    resolve(__dirname, 'src/errors/VhyxUIError.ts'),
        types:     resolve(__dirname, 'src/types/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@vhyxseal/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
