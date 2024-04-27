import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { resolve, dirname,  } from 'path';
import { fileURLToPath  } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url))
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': resolve(__dirname, 'src/components'),
      '@util': resolve(__dirname, 'src/util'),
      '@data': resolve(__dirname, 'src/data'),
      '@pages': resolve(__dirname, 'src/pages')
    }
  },

  esbuild: {
    // loader: { '.js': 'jsx' },
    include: /\.(jsx?)$/,
    jsxInject: "import React from 'react'"
  },
  plugins: [react()],
})
