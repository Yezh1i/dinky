import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import {viteMockServe} from "vite-plugin-mock";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    console.log('command', command)
    console.log('mode', mode)
    return ({
        server:{
            host: '0.0.0.0',
            proxy: {
                '/api': {
                    target: 'http://localhost:8888/dinky/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/api'),
                },
            },
        },
        plugins: [
            react(),
            tailwindcss(),
            viteMockServe({
                mockPath: "./mock",  // mock文件存放的位置
                enable: command === "serve" && mode === "mock", //在开发环境中启用 mock
                logger: true,
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            outDir: 'build',
            sourcemap: false,
            modulePreload: {
                resolveDependencies: () => {
                    return [];
                },
            },
            rollupOptions: {
                output: {
                    sourcemap: false,
                    manualChunks: {
                        ethers: ['ethers'],
                        router: ['react-router-dom'],
                        rtk: ['@reduxjs/toolkit'],
                        redux: ['react-redux'],
                        mantine: ['@mantine/core', '@mantine/hooks'],
                    },
                },
            },
        },
    })
});
