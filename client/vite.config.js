import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // fileURLToPath em vez de __dirname: o pacote é ESM ("type": "module"),
            // onde __dirname não existe. Funcionava porque o Vite compila o
            // ficheiro de configuração, mas era frágil e o lint acusava-o.
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            output: {
                /**
                 * A forma de objeto de manualChunks só corresponde ao especificador
                 * exato: 'react-dom' não capturava 'react-dom/client' (o que main.jsx
                 * importa), pelo que o react-dom acabava no chunk da aplicação, junto
                 * com os dados dos produtos. Resultado: cada produto novo invalidava
                 * 222 KB de cache, incluindo o React inteiro.
                 *
                 * Com a forma de função, cada dependência vai para o chunk certo e
                 * adicionar um produto só invalida o chunk da aplicação.
                 */
                manualChunks(id) {
                    if (!id.includes('node_modules')) return undefined
                    if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
                        return 'vendor-motion'
                    }
                    if (id.includes('react-router')) return 'vendor-router'
                    if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
                        return 'vendor-react'
                    }
                    return undefined
                },
            },
        },
    },
})
