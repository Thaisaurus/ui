import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// import { unstableRolldownAdapter } from 'vite-bundle-analyzer';
// import { analyzer } from 'vite-bundle-analyzer';
// import tsconfigPaths from 'vite-tsconfig-paths';
// https://vite.dev/config/
export default defineConfig({
  build: { target: `esnext` },
  plugins: [
    // unstableRolldownAdapter(analyzer()),
    // tsconfigPaths(),
    tailwindcss(),
    react({
      babel: {
        plugins: [[`babel-plugin-react-compiler`]],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: `@/`,
        replacement: `/`,
      },
    ],
  },
});
