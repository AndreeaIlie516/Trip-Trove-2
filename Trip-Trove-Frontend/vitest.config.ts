import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['setupTests.ts'], // If you have any setup file
  },
  resolve: {
    alias: {
      // Setup any necessary aliases
    },
  },
});