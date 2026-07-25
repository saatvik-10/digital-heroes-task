export type AuditReport = {
  url: string;
  status: number;
  responseTimeMs: number;
  title: string;
  metaDescription: string;
  h1Count: number;
  imageCount: number;
  imagesMissingAlt: number;
  wordCount: number;
};
