/**
 * Shared topic / calculator page header: colored banner with centered text.
 */
export function TopicHeader({ breadcrumb, title }) {
  return (
    <header className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-navy via-navy-light to-blue-700 px-4 py-7 text-center shadow-md sm:mb-8 sm:px-8 sm:py-9">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(147,197,253,0.35) 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl">
        {breadcrumb ? (
          <p className="mb-2 break-words text-xs font-medium tracking-wide text-blue-100/85 sm:text-sm">
            {breadcrumb}
          </p>
        ) : null}
        <h1 className="break-words text-xl font-bold leading-snug text-white sm:text-2xl md:text-3xl">
          {title}
        </h1>
      </div>
    </header>
  );
}
