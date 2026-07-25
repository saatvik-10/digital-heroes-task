export const CheckList = () => {
  return (
    <aside className='rounded-lg border border-line bg-white p-5 shadow-soft'>
      <h2 className='text-lg font-semibold text-ink'>Checks included</h2>
      <ul className='mt-4 grid gap-3 text-sm text-slate-600'>
        <li className='flex gap-3'>
          <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-brand' />
          HTTP status and response time
        </li>
        <li className='flex gap-3'>
          <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-brand' />
          Title and meta description
        </li>
        <li className='flex gap-3'>
          <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-brand' />
          H1, image, and missing alt counts
        </li>
        <li className='flex gap-3'>
          <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-brand' />
          Approximate visible word count
        </li>
      </ul>
    </aside>
  );
};
