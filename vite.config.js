import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        event: resolve(__dirname, 'case-study/event.html'),
        tournament: resolve(__dirname, 'case-study/tournament.html'),
        stash: resolve(__dirname, 'case-study/stash.html'),
      },
    },
  },
});
