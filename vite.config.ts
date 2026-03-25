import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.DEV_MODE": "false",
  },
});
