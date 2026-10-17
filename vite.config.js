import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Fill in the site's own address anywhere index.html asks for it.
 *
 * A share card has to carry absolute URLs: WhatsApp and Facebook fetch
 * og:image without running any JavaScript, and unlike a browser they will not
 * resolve "/images/hero.jpg" against the page they are reading. Hardcoding a
 * domain would break the card on every preview deployment, and the deployment
 * URL changes on every push. Vercel hands the build both addresses, so the
 * card always points at wherever this build actually lives.
 */
function siteAddress() {
  return {
    name: "site-address",
    transformIndexHtml(html) {
      const host =
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        process.env.VERCEL_URL ||
        "localhost:3000";
      const scheme = host.startsWith("localhost") ? "http" : "https";
      return html.replaceAll("__SITE_URL__", `${scheme}://${host}`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteAddress()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    // Allow the sandbox preview host (*.e2b.app) through Vite's Host-header
    // check, alongside localhost. Without this the dev server returns 403.
    allowedHosts: [".e2b.app", "localhost"],
  },
});
