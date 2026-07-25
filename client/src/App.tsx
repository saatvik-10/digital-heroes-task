import { SyntheticEvent, useMemo, useState } from 'react';
import axios from 'axios';
import { TextResult } from './components/textResult';
import { AuditReport } from './types';
import { sampleUrls } from './data/sampleUrls';
import { Skeleton } from './components/skeleton';
import { CheckList } from './components/checksList';
import Footer from './components/footer';
import Header from './components/header';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:3000';

export default function App() {
  const [url, setUrl] = useState('https://example.com');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reportStats = useMemo(() => {
    if (!report) return [];

    return [
      { label: 'HTTP status', value: report.status },
      { label: 'Response time', value: `${report.responseTimeMs} ms` },
      { label: 'H1 tags', value: report.h1Count },
      { label: 'Images', value: report.imageCount },
      { label: 'Missing alt text', value: report.imagesMissingAlt },
      { label: 'Word count', value: report.wordCount },
    ];
  }, [report]);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setReport(null);
    setIsLoading(true);

    try {
      const response = await axios.post<AuditReport>(
        `${API_BASE_URL}/api/audit`,
        { url },
      );

      setReport(response.data);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.error ?? 'Audit failed.')
          : err instanceof Error
            ? err.message
            : 'Audit failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='min-h-screen bg-panel text-ink'>
      <section className='border-b border-line bg-white'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 md:px-8'>
          <Header />

          <form
            onSubmit={handleSubmit}
            className='flex w-full flex-col gap-3 rounded-lg border border-line bg-panel p-3 shadow-soft md:flex-row'
          >
            <label className='sr-only' htmlFor='url'>
              URL to audit
            </label>
            <input
              id='url'
              className='min-h-12 flex-1 rounded-md border border-line bg-white px-4 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-blue-100'
              placeholder='https://example.com'
              type='url'
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />
            <button
              className='min-h-12 rounded-md bg-brand px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? 'Auditing...' : 'Run audit'}
            </button>
          </form>

          <div className='flex flex-wrap gap-2'>
            {sampleUrls.map((sampleUrl) => (
              <button
                key={sampleUrl}
                type='button'
                className='rounded-full border border-line bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-brand hover:text-brand'
                onClick={() => setUrl(sampleUrl)}
              >
                {sampleUrl}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto grid w-full max-w-6xl gap-5 px-5 py-8 md:grid-cols-[1fr_340px] md:px-8'>
        <div className='rounded-lg border border-line bg-white p-5 shadow-soft'>
          <div className='mb-5 flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-semibold text-ink'>Audit report</h2>
              <p className='mt-1 text-sm text-slate-500'>
                Results appear here after the backend fetches and parses the
                page.
              </p>
            </div>
          </div>

          {error ? (
            <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700'>
              {error}
            </div>
          ) : null}

          {isLoading ? <Skeleton /> : null}

          {!report && !error && !isLoading ? (
            <div className='rounded-md border border-dashed border-line p-8 text-center text-sm text-slate-500'>
              Enter a public URL and run an audit.
            </div>
          ) : null}

          {report ? (
            <div className='grid gap-5'>
              <div className='rounded-md border border-line bg-panel p-4'>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                  Final URL
                </p>
                <p className='mt-1 break-all text-sm font-medium text-ink'>
                  {report.url}
                </p>
              </div>

              <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                {reportStats.map((stat) => (
                  <div
                    className='rounded-md border border-line bg-white p-4'
                    key={stat.label}
                  >
                    <p className='text-sm text-slate-500'>{stat.label}</p>
                    <p className='mt-2 text-2xl font-bold text-ink'>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className='grid gap-3'>
                <TextResult label='Page title' value={report.title} />
                <TextResult
                  label='Meta description'
                  value={report.metaDescription}
                />
              </div>
            </div>
          ) : null}
        </div>

        <CheckList />
      </section>

      <Footer />
    </main>
  );
}
