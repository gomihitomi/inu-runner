import type { UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  base: process.env.GITHUB_ACTIONS ? "/inu-runner/" : "",
  plugins: [tsconfigPaths()],
  server: {
    host: true,
    proxy: {
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
      },
    },
  },
} satisfies UserConfig;
