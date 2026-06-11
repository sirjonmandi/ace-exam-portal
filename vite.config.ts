import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import fs from "node:fs";

// Writes .htaccess into dist/ after every production build
function writeHtaccess(): Plugin {
  return {
    name: "write-htaccess",
    apply: "build",
    closeBundle() {
      fs.writeFileSync(
        "dist/.htaccess",
        [
          "Options -MultiViews",
          "DirectoryIndex index.html",
          "",
          "<IfModule mod_deflate.c>",
          "  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json",
          "</IfModule>",
          "",
          "<IfModule mod_expires.c>",
          "  ExpiresActive On",
          "  ExpiresByType application/javascript \"access plus 1 year\"",
          "  ExpiresByType text/css \"access plus 1 year\"",
          "  ExpiresByType text/html \"access plus 0 seconds\"",
          "</IfModule>",
          "",
          "<IfModule mod_headers.c>",
          "  <FilesMatch \"\\.(js|css)$\">",
          "    Header set Cache-Control \"max-age=31536000, immutable\"",
          "  </FilesMatch>",
          "  <FilesMatch \"\\.html$\">",
          "    Header set Cache-Control \"no-cache, no-store, must-revalidate\"",
          "  </FilesMatch>",
          "</IfModule>",
        ].join("\n") + "\n",
      );
    },
  };
}

export default defineConfig(({ command }) => ({
  // Use root-relative paths in dev, subpath in production build
  base: command === "build" ? "/cfa-mock-portal/" : "/",

  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    writeHtaccess(),
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
