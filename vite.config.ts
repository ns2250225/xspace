import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({plugins:[vue()],clearScreen:false,server:{port:1420,strictPort:true,host:'127.0.0.1'},envPrefix:['VITE_','TAURI_'],build:{target:'es2021',minify:!process.env.TAURI_DEBUG,sourcemap:!!process.env.TAURI_DEBUG}});
