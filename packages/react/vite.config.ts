import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import type { Plugin } from 'vite';

/**
 * Wraps the emitted component stylesheet in `@layer components` and pins the
 * standard layer order first (DECISION-UI-004). Result:
 * - Tailwind v4 utilities (`@layer utilities`) override component styles with no `!important`.
 * - Tailwind's preflight (`@layer base`) can never clobber component styles,
 *   regardless of which stylesheet is imported first.
 * - Plain, unlayered app CSS always wins over the library.
 */
function layerComponentsCss(): Plugin {
  return {
    name: 'vhyxui-layer-components',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css') && typeof file.source === 'string') {
          if (file.source.includes('@layer components{')) continue;
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
        pagination:     resolve(__dirname, 'src/components/Pagination/index.ts'),
        textfield:      resolve(__dirname, 'src/components/TextField/index.ts'),
        textareafield:  resolve(__dirname, 'src/components/TextareaField/index.ts'),
        selectfield:    resolve(__dirname, 'src/components/SelectField/index.ts'),
        stack:          resolve(__dirname, 'src/components/Stack/index.ts'),
        grid:           resolve(__dirname, 'src/components/Grid/index.ts'),
        container:      resolve(__dirname, 'src/components/Container/index.ts'),
        center:         resolve(__dirname, 'src/components/Center/index.ts'),
        text:           resolve(__dirname, 'src/components/Text/index.ts'),
        heading:        resolve(__dirname, 'src/components/Heading/index.ts'),
        avatar:         resolve(__dirname, 'src/components/Avatar/index.ts'),
        skeleton:       resolve(__dirname, 'src/components/Skeleton/index.ts'),
        kbd:            resolve(__dirname, 'src/components/Kbd/index.ts'),
        'visually-hidden': resolve(__dirname, 'src/components/VisuallyHidden/index.ts'),
        accordion:      resolve(__dirname, 'src/components/Accordion/index.ts'),
        table:          resolve(__dirname, 'src/components/Table/index.ts'),
        utils:          resolve(__dirname, 'src/utils/index.ts'),
        'test-utils':   resolve(__dirname, 'src/test-utils/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Regexes so subpaths (react/jsx-runtime, react-dom/client) stay external too.
      // Bundling React 19's jsx-runtime broke React 18 consumers (element symbol mismatch).
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@vhyxseal\//, /^@vhyxui\//, /^@testing-library\//],
      output: {
        // Every component entry is a client boundary for React Server Components.
        // Shared chunks and non-component entries stay directive-free so server
        // code can still call helpers like cx().
        banner: (chunk) =>
          chunk.isEntry && !['utils', 'test-utils'].includes(chunk.name) ? "'use client';" : '',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
