export const Skeleton = () => {
  return (
    <div className='grid gap-3'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className='h-16 animate-pulse rounded-md bg-slate-100'
          key={index}
        />
      ))}
    </div>
  );
};
