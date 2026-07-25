import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { auditRequestSchema } from '../validator/audit.validator';
import { auditUrl } from '../services/audit.service';
import { AuditRouteOptions } from '../types';

export function createAuditRoute(options: AuditRouteOptions = {}) {
  const route = new Hono();
  const auditPage = options.auditPage ?? auditUrl;

  route.post('/', async (c) => {
    let body: unknown;

    try {
      body = await c.req.json();
    } catch {
      throw new HTTPException(400, {
        message: 'Request body must be valid JSON.',
      });
    }

    const parsed = auditRequestSchema.safeParse(body);

    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const report = await auditPage(parsed.data.url);
    return c.json(report);
  });

  return route;
}

function throwValidationError(error: ZodError): never {
  throw new HTTPException(400, {
    message: error.issues[0]?.message ?? 'Invalid request body.',
  });
}
