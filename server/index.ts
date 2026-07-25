import { serve } from 'bun';
import { app } from './src/app';

const port = Number(process.env.PORT ?? 3000);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Page Pulse API running on port ${port}`);
