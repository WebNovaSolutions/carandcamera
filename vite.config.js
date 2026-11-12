import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import loginHandler from './api/auth/login.js';
import logoutHandler from './api/auth/logout.js';
import meHandler from './api/auth/me.js';
import saveContentHandler from './api/admin/save-content.js';

function devApiPlugin(env) {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      // Inject env into process.env for the handlers
      Object.assign(process.env, env);

      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        // Helper mock for req/res to match Vercel Serverless Function signature
        const customRes = {
          statusCode: 200,
          setHeader: (name, value) => res.setHeader(name, value),
          status(code) {
            this.statusCode = code;
            res.statusCode = code;
            return this;
          },
          json(data) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = this.statusCode;
            res.end(JSON.stringify(data));
          },
          text(data) {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = this.statusCode;
            res.end(data);
          },
        };

        // Read body for POST/PUT requests
        let bodyBuffer = [];
        req.on('data', chunk => bodyBuffer.push(chunk));
        await new Promise(resolve => req.on('end', resolve));
        const rawBody = Buffer.concat(bodyBuffer).toString('utf-8');

        try {
          req.body = rawBody ? JSON.parse(rawBody) : {};
        } catch (e) {
          req.body = rawBody;
        }

        try {
          if (url === '/api/auth/login') {
            return await loginHandler(req, customRes);
          } else if (url === '/api/auth/logout') {
            return await logoutHandler(req, customRes);
          } else if (url === '/api/auth/me') {
            return await meHandler(req, customRes);
          } else if (url === '/api/admin/save-content') {
            return await saveContentHandler(req, customRes);
          } else {
            customRes.status(404).json({ error: 'API route not found' });
          }
        } catch (err) {
          console.error('Dev API Error:', err);
          customRes.status(500).json({ error: err.message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApiPlugin(env)],
    server: {
      port: 5173,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            icons: ['lucide-react'],
          },
        },
      },
    },
  };
});
