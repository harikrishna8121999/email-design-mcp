import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadEmail } from '../lib/storage.js';

const DEFAULT_PORT = 3947;

let previewServer: Server | null = null;
let connectedClients: ServerResponse[] = [];

/**
 * Starts the preview HTTP server. Serves email previews and SSE for hot reload.
 */
export async function startPreviewServer(port: number = DEFAULT_PORT): Promise<{ port: number; url: string }> {
  if (previewServer) {
    return { port, url: `http://localhost:${port}` };
  }

  return new Promise((resolve, reject) => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url || '/', `http://localhost:${port}`);

      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');

      // SSE endpoint for hot reload
      if (url.pathname === '/events') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        });
        res.write('data: connected\n\n');
        connectedClients.push(res);
        req.on('close', () => {
          connectedClients = connectedClients.filter((c) => c !== res);
        });
        return;
      }

      // Preview endpoint: /preview/:emailId
      const previewMatch = url.pathname.match(/^\/preview\/([a-zA-Z0-9-]+)$/);
      if (previewMatch) {
        const emailId = previewMatch[1];
        const email = await loadEmail(emailId);

        if (!email || !email.html) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>Email not found</h1><p>This email has not been compiled yet.</p>');
          return;
        }

        // Inject hot-reload script into the HTML
        const htmlWithReload = injectHotReload(email.html, port);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(htmlWithReload);
        return;
      }

      // Mobile preview: /preview/:emailId/mobile
      const mobileMatch = url.pathname.match(/^\/preview\/([a-zA-Z0-9-]+)\/mobile$/);
      if (mobileMatch) {
        const emailId = mobileMatch[1];
        const email = await loadEmail(emailId);

        if (!email || !email.html) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>Email not found</h1>');
          return;
        }

        const mobileWrapper = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Mobile Preview — ${emailId}</title>
  <style>
    body { margin: 0; background: #f0f0f0; display: flex; justify-content: center; padding: 20px; }
    .phone-frame {
      width: 375px;
      border: 2px solid #333;
      border-radius: 20px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    }
    iframe { width: 100%; height: 800px; border: none; }
  </style>
</head>
<body>
  <div class="phone-frame">
    <iframe src="/preview/${emailId}"></iframe>
  </div>
  ${hotReloadScript(port)}
</body>
</html>`;

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(mobileWrapper);
        return;
      }

      // Index page
      if (url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html>
<head><title>Email Design MCP — Preview Server</title></head>
<body>
  <h1>Email Design MCP Preview Server</h1>
  <p>Use <code>/preview/{emailId}</code> to preview an email.</p>
  <p>Use <code>/preview/{emailId}/mobile</code> for mobile preview.</p>
</body>
</html>`);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        // Port already in use — server likely already running
        resolve({ port, url: `http://localhost:${port}` });
      } else {
        reject(err);
      }
    });

    server.listen(port, () => {
      previewServer = server;
      resolve({ port, url: `http://localhost:${port}` });
    });
  });
}

/**
 * Notifies all connected SSE clients to reload.
 */
export function notifyReload(emailId: string): void {
  const message = `data: ${JSON.stringify({ type: 'reload', emailId })}\n\n`;
  for (const client of connectedClients) {
    client.write(message);
  }
}

/**
 * Stops the preview server.
 */
export async function stopPreviewServer(): Promise<void> {
  if (previewServer) {
    for (const client of connectedClients) {
      client.end();
    }
    connectedClients = [];
    return new Promise((resolve) => {
      previewServer!.close(() => {
        previewServer = null;
        resolve();
      });
    });
  }
}

function hotReloadScript(port: number): string {
  return `<script>
(function() {
  var es = new EventSource('http://localhost:${port}/events');
  es.onmessage = function(e) {
    try {
      var data = JSON.parse(e.data);
      if (data.type === 'reload') { location.reload(); }
    } catch(err) {}
  };
  es.onerror = function() { setTimeout(function() { location.reload(); }, 3000); };
})();
</script>`;
}

function injectHotReload(html: string, port: number): string {
  const script = hotReloadScript(port);
  if (html.includes('</body>')) {
    return html.replace('</body>', `${script}</body>`);
  }
  return html + script;
}
