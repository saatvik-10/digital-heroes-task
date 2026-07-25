import axios from 'axios';
import { HTTPException } from 'hono/http-exception';
import { auditRequestSchema } from '../validator/audit.validator';
import {
  badGateway,
  requestTimeout,
  unsupportedMediaType,
} from '../utils/http-errors';
import { isHtmlResponse } from '../utils/lib';
import { extractPageMetrics } from '../utils/cheerio';
import { AuditOptions, AuditReport } from '../types';
import { DEFAULT_TIMEOUT_MS } from '../utils/config';

export async function auditUrl(
  rawUrl: string,
  options: AuditOptions = {},
): Promise<AuditReport> {
  const url = parseHttpUrl(rawUrl);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const startedAt = performance.now();

  try {
    const response = await axios.get(url.toString(), {
      timeout: timeoutMs,
      responseType: 'text',
      maxRedirects: 20,
      headers: {
        'user-agent': 'PagePulseBot/1.0 (+https://digitalheroesco.com)',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    const responseTimeMs = Math.round(performance.now() - startedAt);
    const contentType = String(response.headers['content-type'] ?? '');

    if (!isHtmlResponse(contentType)) {
      throw unsupportedMediaType('The target URL did not return an HTML page.');
    }

    return {
      url: response.request?.res?.responseUrl ?? url.toString(),
      status: response.status,
      responseTimeMs,
      ...extractPageMetrics(response.data as string),
    };
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }

    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      throw requestTimeout('The target URL took too long to respond.');
    }

    throw badGateway('The target URL could not be fetched.');
  }
}

export function parseHttpUrl(rawUrl: string): URL {
  const result = auditRequestSchema.safeParse({ url: rawUrl });

  if (!result.success) {
    throw new HTTPException(400, {
      message: result.error.issues[0]?.message ?? 'Invalid URL.',
    });
  }

  return new URL(result.data.url);
}
