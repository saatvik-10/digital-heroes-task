const Header = () => {
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm font-semibold uppercase tracking-wide text-brand'>
        Page Pulse
      </p>
      <h1 className='max-w-3xl text-4xl font-bold tracking-normal text-ink md:text-5xl'>
        Audit any URL in seconds.
      </h1>
      <p className='max-w-2xl text-base leading-7 text-slate-600'>
        Check status, speed, metadata, headings, images, alt text, and
        approximate page copy from one clean report.
      </p>
    </div>
  );
};

export default Header;
