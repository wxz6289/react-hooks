import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { resolve, dirname,  } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url))
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': resolve(__dirname, 'src/'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
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
  plugins: [react(), tailwindcss()],
})
