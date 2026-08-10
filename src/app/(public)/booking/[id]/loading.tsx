export default function BookingLoading() {
  return (
    <main className="min-h-screen bg-muted/20">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1800px]">
          <div className="mb-8 space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />

            <div className="h-8 w-64 animate-pulse rounded bg-muted" />

            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div className="h-44 animate-pulse rounded-2xl bg-muted" />

              <div className="h-52 animate-pulse rounded-2xl bg-muted" />

              <div className="h-96 animate-pulse rounded-2xl bg-muted" />

              <div className="h-72 animate-pulse rounded-2xl bg-muted" />
            </div>

            <div className="hidden h-96 animate-pulse rounded-2xl bg-muted lg:block" />
          </div>
        </div>
      </div>
    </main>
  );
}
