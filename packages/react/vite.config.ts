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
        index:      resolve(__dirname, 'src/index.ts'),
        button:     resolve(__dirname, 'src/components/Button/index.ts'),
        input:      resolve(__dirname, 'src/components/Input/index.ts'),
        textarea:   resolve(__dirname, 'src/components/Textarea/index.ts'),
        select:     resolve(__dirname, 'src/components/Select/index.ts'),
        checkbox:   resolve(__dirname, 'src/components/Checkbox/index.ts'),
        radio:      resolve(__dirname, 'src/components/Radio/index.ts'),
        switch:     resolve(__dirname, 'src/components/Switch/index.ts'),
        form:       resolve(__dirname, 'src/components/Form/index.ts'),
        toast:      resolve(__dirname, 'src/components/Toast/index.ts'),
        alert:      resolve(__dirname, 'src/components/Alert/index.ts'),
        badge:      resolve(__dirname, 'src/components/Badge/index.ts'),
        progress:   resolve(__dirname, 'src/components/Progress/index.ts'),
        spinner:    resolve(__dirname, 'src/components/Spinner/index.ts'),
        dialog:     resolve(__dirname, 'src/components/Dialog/index.ts'),
        drawer:     resolve(__dirname, 'src/components/Drawer/index.ts'),
        tooltip:    resolve(__dirname, 'src/components/Tooltip/index.ts'),
        popover:    resolve(__dirname, 'src/components/Popover/index.ts'),
        card:       resolve(__dirname, 'src/components/Card/index.ts'),
        separator:  resolve(__dirname, 'src/components/Separator/index.ts'),
        tabs:       resolve(__dirname, 'src/components/Tabs/index.ts'),
        breadcrumb: resolve(__dirname, 'src/components/Breadcrumb/index.ts'),
        pagination: resolve(__dirname, 'src/components/Pagination/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@vhyxseal/react', '@vhyxui/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
