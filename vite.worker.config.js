import { defineConfig } from 'vite';
export default defineConfig({
  ssr: { target: 'webworker', noExternal: true },
  build: { ssr: 'server/worker.js', outDir: 'dist', emptyOutDir: false, minify: true, rollupOptions: { output: { entryFileNames: '_worker.js' } } },
});
