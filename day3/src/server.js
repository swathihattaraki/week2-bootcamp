import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';

const send = (res, status, data, type = 'application/json') => {
  res.writeHead(status, { 'Content-Type': type });
  res.end(type === 'application/json' ? JSON.stringify(data) : data);
};

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/') {
      const html = await fs.readFile(new URL('../../public/index.html', import.meta.url));
      return send(res, 200, html, 'text/html');
    }
    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, { status: 'ok', uptime: process.uptime() });
    }
    if (req.method === 'GET' && url.pathname === '/api/info') {
      return send(res, 200, { app: config.appName, env: config.env, node: process.version });
    }
    if (req.method === 'GET' && url.pathname === '/api/validate') {
      const file = path.basename(url.searchParams.get('file') || '');
      if (!file) return send(res, 400, { error: 'Provide a file name' });

      try {
        const data = JSON.parse(await fs.readFile(path.resolve(file), 'utf-8'));
        if (!Array.isArray(data) || !data.every(x => typeof x?.name === 'string' && typeof x?.role === 'string')) {
          return send(res, 400, { error: 'JSON must be an array of { name, role } strings' });
        }
        const roles = [...new Set(data.map(x => x.role))];
        return send(res, 200, { status: 'Valid JSON', records: data.length, roles });
      } catch (err) {
        const msg = err.code === 'ENOENT' ? `File not found: ${file}`
          : err.name === 'SyntaxError' ? 'Malformed JSON format' : 'Unexpected error';
        return send(res, 400, { error: msg });
      }
    }

    send(res, 404, { error: 'Not found' });
  } catch {
    send(res, 500, { error: 'Internal server error' });
  }
}).listen(config.port, () => console.log(`Running on http://localhost:${config.port}`));