import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'assets-source']),

  // Aplicação
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // Sem esta regra o ESLint não sabe que um identificador usado em JSX está
      // a ser usado: `import { motion }` era reportado como não utilizado em
      // todos os componentes — 8 falsos positivos que tornavam `npm run lint`
      // inútil e escondiam os avisos legítimos de react-hooks.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },

  // Contexto: ficheiro combina o Provider com o hook que o lê — padrão comum
  // do React, mas a regra do fast refresh só tolera ficheiros que exportem
  // só componentes. Não há aqui nenhum componente a perder hot-reload.
  {
    files: ['src/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Scripts de build (Node, não browser)
  {
    files: ['scripts/**/*.mjs', 'vite.config.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.node },
      sourceType: 'module',
    },
  },
])
