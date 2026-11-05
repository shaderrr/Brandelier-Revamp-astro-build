import { defineMiddleware } from 'astro:middleware';
import fs from 'node:fs';
import path from 'node:path';

export const onRequest = defineMiddleware(async (context, next) => {
  // During local development, handle Content Negotiation for Accept: text/markdown
  if (import.meta.env.DEV) {
    try {
      const accept = context.request?.headers?.get('accept') || '';
      if (accept.includes('text/markdown') && (context.url.pathname === '/' || context.url.pathname === '')) {
        const mdPath = path.join(process.cwd(), 'public', 'index.md');
        if (fs.existsSync(mdPath)) {
          const content = fs.readFileSync(mdPath, 'utf-8');
          return new Response(content, {
            status: 200,
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'Vary': 'Accept',
              'Content-Signal': 'search=yes, ai-train=no'
            }
          });
        }
      }
    } catch (_e) {
      // Fall through to normal response
    }
  }

  const response = await next();
  return response;
});
