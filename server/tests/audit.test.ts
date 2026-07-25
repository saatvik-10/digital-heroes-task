import { describe, expect, test, mock } from 'bun:test';
import { HTTPException } from 'hono/http-exception';
import { auditUrl, parseHttpUrl } from '../src/services/audit.service';
import { extractPageMetrics } from '../src/utils/cheerio';

describe('parseHttpUrl', () => {
  test('accepts valid http and https URLs', () => {
    expect(parseHttpUrl('https://example.com').toString()).toBe(
      'https://example.com/',
    );
    expect(parseHttpUrl('http://example.com').toString()).toBe(
      'http://example.com/',
    );
  });

  test('rejects malformed URLs', () => {
    expect(() => parseHttpUrl('not a url')).toThrow(HTTPException);
  });

  test('rejects empty URLs', () => {
    expect(() => parseHttpUrl('')).toThrow(HTTPException);
  });

  test('rejects unsupported URL schemes', () => {
    expect(() => parseHttpUrl('ftp://example.com')).toThrow(HTTPException);
  });
});

describe('extractPageMetrics', () => {
  test('counts SEO and content metrics from HTML', () => {
    const metrics = extractPageMetrics(`
      <html>
        <head>
          <title> Test Page </title>
          <meta name="description" content="A short description." />
        </head>
        <body>
          <h1>Main Heading</h1>
          <h1>Second Heading</h1>
          <img src="/ok.png" alt="Useful text" />
          <img src="/missing.png" />
          <img src="/empty.png" alt=" " />
          <p>Hello world from Page Pulse.</p>
          <script>ignored words here</script>
        </body>
      </html>
    `);

    expect(metrics).toEqual({
      title: 'Test Page',
      metaDescription: 'A short description.',
      h1Count: 2,
      imageCount: 3,
      imagesMissingAlt: 2,
      wordCount: 9,
    });
  });
});

describe('auditUrl', () => {
  test('returns a report for an HTML response', async () => {
    mock.module('axios', () => ({
      default: {
        get: async () => ({
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8' },
          data: `
            <html>
              <head><title>Example</title></head>
              <body><h1>Hello</h1><p>One two three</p></body>
            </html>
          `,
          request: { res: { responseUrl: 'https://example.com/' } },
        }),
      },
    }));

    const report = await auditUrl('https://example.com');

    expect(report.status).toBe(200);
    expect(report.title).toBe('Example');
    expect(report.h1Count).toBe(1);
    expect(report.wordCount).toBe(3);
  });

  test('rejects non-HTML responses', async () => {
    mock.module('axios', () => ({
      default: {
        get: async () => ({
          status: 200,
          headers: { 'content-type': 'application/json' },
          data: '{"ok":true}',
          request: { res: { responseUrl: 'https://example.com/data.json' } },
        }),
      },
    }));

    await expect(
      auditUrl('https://example.com/data.json'),
    ).rejects.toMatchObject({ status: 415 });
  });

  test('maps slow responses to a timeout error', async () => {
    mock.module('axios', () => ({
      default: {
        get: async () => {
          throw Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
        },
        isAxiosError: (err: unknown) =>
          (err as { code?: string })?.code === 'ECONNABORTED',
      },
    }));

    await expect(
      auditUrl('https://example.com', { timeoutMs: 1 }),
    ).rejects.toMatchObject({ status: 408 });
  });
});
