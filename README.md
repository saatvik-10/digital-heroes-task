# Page Pulse

Page Pulse audits a public URL and returns a small SEO and accessibility snapshot. It was built for the Digital Heroes SDE task using a split frontend/backend deployment model.

## Stack

- Client: React, Vite, Tailwind CSS
- Server: Bun, Hono, Cheerio
- Validation: Zod
- Tests: bun:test
- Deployment: Vercel for `client`, Render for `server`

Prisma and Neon are intentionally not included because this version does not persist audit history.

## Local Setup

Install dependencies:

```bash
cd server
bun install

cd ../client
bun install
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

Create `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Create `server/.env` if you need a custom frontend origin:

```env
CLIENT_ORIGIN=http://localhost:5173
```

## API Contract

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
  "error": "Invalid URL. Please provide a valid http or https URL.",
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

```bash
cd server
bun test
```

Covered cases:

- parser happy path for valid `http` and `https` URLs
- parser failure for malformed URLs
- parser failure for unsupported URL schemes
- timeout handling
- non-HTML response
- API success and error response shape

## Design Decisions

1. The audit logic is separated from the Hono app so tests can exercise URL validation, fetch behavior, and HTML parsing without running a server.
2. The API accepts only `http` and `https` URLs, then rejects non-HTML responses with `415`, because the requested metrics require a fetchable HTML document.
3. The backend is split into `routes`, `validator`, `services`, and `utils` so validation, transport, and audit logic stay separate without adding unnecessary controller boilerplate.

## Deployment

### Render Backend

The repo includes `render.yaml` and `server/Dockerfile` for a Docker-based Render web service. If you configure it manually instead, use `server` as the root directory, `bun install` as the build command, and `bun run start` as the start command.

Environment:

```env
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
```

### Vercel Frontend

Root directory:

```text
client
```

Build command:

```bash
bun run build
```

Output directory:

```text
dist
```

Environment:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

## Task Credit

The frontend footer includes the required credit link: Built for Digital Heroes Training Task.
