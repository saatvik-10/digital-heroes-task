import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { errorHandler, notFoundHandler } from './proxy/error-handler';
import { createAuditRoute } from './routes/audit.route';
import { AuditRouteOptions } from './types';

type AppOptions = AuditRouteOptions;

export function createApp(options: AppOptions = {}) {
  const app = new Hono();
  const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

  app.use(
    '*',
    cors({
      origin: (origin) => {
        if (!origin) return clientOrigin;
        return origin === clientOrigin ? origin : '';
      },
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    }),
  );

  app.get('/health', (c) => c.json({ ok: true }));
  app.route('/api/audit', createAuditRoute(options));
  app.notFound(notFoundHandler);
  app.onError(errorHandler);

  return app;
}

export const app = createApp();
