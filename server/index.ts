import server from './src/';
import path from 'node:path';

server.listen(3000);

const env = process.env.NODE_ENV || 'dev';
const port = process.env['CLIENT_PORT'] || 8080;
const staticDir = process.env['STATIC_DIR'] || path.join(process.cwd(), "server/public");

if (env === 'prod') {
  Bun.serve({
    port: port,
    async fetch(req) {
      const requestPath = new URL(req.url).pathname;
      if (requestPath === "/") {
        const file = Bun.file(path.join(staticDir, "index.html"));
        return new Response(file)
      }
      const file = Bun.file("./server/public" + requestPath);
      return new Response(file)
    }
  });
}

