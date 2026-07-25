import { describe, expect, test } from 'bun:test';
import { HTTPException } from 'hono/http-exception';
import { createApp } from '../src/app';

describe('POST /api/audit', () => {
  test('returns an audit report', async () => {
    const app = createApp({
      auditPage: async (url) => ({
        url,
        status: 200,
        responseTimeMs: 20,
        title: 'Example',
        metaDescription: 'Description',
        h1Count: 1,
        imageCount: 2,
        imagesMissingAlt: 1,
        wordCount: 10,
      }),
    });

    const response = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      url: 'https://example.com',
      title: 'Example',
      imagesMissingAlt: 1,
    });
  });

  test('returns 400 for missing URL', async () => {
    const app = createApp();

    const response = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'URL is required.',
      status: 400,
    });
  });

  test('returns expected error shape for HTTPException', async () => {
    const app = createApp({
      auditPage: async () => {
        throw new HTTPException(415, {
          message: 'The target URL did not return an HTML page.',
        });
      },
    });

    const response = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com/file.pdf' }),
    });

    expect(response.status).toBe(415);
    expect(await response.json()).toEqual({
      error: 'The target URL did not return an HTML page.',
      status: 415,
    });
  });
});
