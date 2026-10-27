import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import site from './site.config.json';

/** Põe o endereço do site e, se houver, o ID do AdSense no index.html (a fonte é site.config.json). */
const siteConfig = (): Plugin => ({
  name: 'site-config',
  transformIndexHtml(html) {
    const on = !!site.adsenseClient && Object.values(site.slots).some(Boolean);
    const meta = [
      site.adsenseClient ? `<meta name="google-adsense-account" content="${site.adsenseClient}">` : '',
      on ? `<meta name="adsense-client" content="${site.adsenseClient}">` : '',
    ].filter(Boolean).join('\n');
    return html.replaceAll('__SITE_URL__', site.siteUrl.replace(/\/$/, '')).replace('</head>', `${meta}\n</head>`);
  },
});

export default defineConfig({
  plugins: [react(), siteConfig()],
  // dev: o servidor de grupos roda à parte (npm run server) e o Vite repassa /api para ele
  server: { proxy: { '/api': 'http://localhost:3001' } },
});
