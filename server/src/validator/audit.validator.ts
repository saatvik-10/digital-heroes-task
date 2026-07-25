import { z } from 'zod';

export const auditRequestSchema = z.object({
  url: z
    .string({
      error: 'URL is required.',
    })
    .trim()
    .min(1, 'URL is required.')
    .refine((value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === 'http:' || protocol === 'https:';
      } catch {
        return false;
      }
    }, 'Invalid URL. Please provide a valid http or https URL.'),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;
