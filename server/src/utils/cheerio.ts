import * as cheerio from 'cheerio';
import { normalizeText } from './lib';

export function extractPageMetrics(html: string) {
  const $ = cheerio.load(html);
  const title = normalizeText($('title').first().text());
  const metaDescription = normalizeText(
    $('meta[name="description" i]').first().attr('content') ?? '',
  );
  const imageCount = $('img').length;
  const imagesMissingAlt = $('img')
    .toArray()
    .filter((image) => {
      const alt = $(image).attr('alt');
      return alt === undefined || alt.trim().length === 0;
    }).length;

  $('script, style, noscript, svg').remove();
  const bodyText = normalizeText($('body').text());

  return {
    title,
    metaDescription,
    h1Count: $('h1').length,
    imageCount,
    imagesMissingAlt,
    wordCount: bodyText ? bodyText.split(/\s+/).length : 0,
  };
}
