# Page Pulse

Page Pulse audits a public URL and returns a compact SEO and accessibility snapshot. The app is split into a React client and a Bun/Hono server so the audit flow stays simple and testable.

## Stack

- Client: React, Vite, Tailwind CSS, Axios
- Server: Bun, Hono, Cheerio
- Validation: Zod
- Tests: `bun:test`

The app does not persist audit history, so Prisma and a database are not part of this version.

## Repository Layout

- `client/` contains the UI and Vite app.
- `server/` contains the audit API, validation, and tests.

## Local Setup

Install dependencies in both workspaces:

```bash
cd server
bun install

cd ../client
bun install
```

Copy the provided environment examples if you want local overrides:

```bash
cp client/.env.example client/.env.local
cp server/.env.example server/.env
```

The defaults are:

```env
# client/.env.local
VITE_API_BASE_URL=http://localhost:3000

# server/.env
CLIENT_ORIGIN=http://localhost:5173
PORT=3000
```

Run the API:

```bash
cd server
bun run dev
```

Run the frontend:

```bash
cd client
bun run dev
```

Optional production builds:

```bash
cd server
bun run start

cd ../client
bun run build
```

## API

### `GET /health`

Returns:

```json
{ "ok": true }
```

### `POST /api/audit`

Request:

```json
{
  "url": "https://example.com"
}
```

Success response:

```json
{
  "url": "https://example.com/",
  "status": 200,
  "responseTimeMs": 132,
  "title": "Example Domain",
  "metaDescription": "",
  "h1Count": 1,
  "imageCount": 0,
  "imagesMissingAlt": 0,
  "wordCount": 28
}
```

Error response:

```json
{
  "error": "URL is required.",
  "status": 400
}
```

## Error Handling

The API uses Hono `HTTPException` for expected failures:

- `400`: missing or invalid URL
- `408`: target page timed out
- `415`: target did not return HTML
- `502`: target could not be fetched
- `500`: unexpected server error

## Tests

Run the server test suite with:

```bash
cd server
bun test
```

Covered cases:

- audit success path
- validation failure for missing or malformed URLs
- unsupported URL schemes
- timeout handling
- non-HTML responses
- API success and error response shapes

## Design Notes

1. Audit logic is separated from the Hono app so tests can exercise validation, fetch behavior, and HTML parsing without running a server.
2. The API only accepts `http` and `https` URLs because the requested metrics require a fetchable HTML document.
3. The backend is organized into `routes`, `validator`, `services`, and `utils` to keep transport, validation, and parsing concerns separate.

## Deployment Notes

Set the frontend to point at the deployed API with `VITE_API_BASE_URL`, and set `CLIENT_ORIGIN` on the server to the deployed client origin. The server also respects `PORT` when your hosting provider supplies one.

## Task Credit

The frontend footer includes the required credit link: Built for Digital Heroes Training Task.
