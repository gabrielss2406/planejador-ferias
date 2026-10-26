import { createServer } from 'node:http';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.mjs';
import { openStore } from './store.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dbFile = resolve(process.env.DB_FILE ?? resolve(here, '../data/ferias.db'));
mkdirSync(dirname(dbFile), { recursive: true });

const store = openStore(dbFile);
console.log(`Salas antigas removidas: ${store.sweep()}`);
setInterval(() => store.sweep(), 24 * 36e5).unref();

const port = Number(process.env.PORT ?? 3001);
const distDir = resolve(process.env.DIST_DIR ?? resolve(here, '../dist'));
createServer(createApp(store, { distDir })).listen(port, () => {
  console.log(`Planejador de Férias em http://localhost:${port} (banco: ${dbFile})`);
});
