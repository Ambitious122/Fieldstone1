"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-fs flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <p className="eyebrow text-clay">Something went wrong</p>
      <h1 className="font-display text-3xl">We hit a snag loading this page.</h1>
      <p className="max-w-sm text-stone-600">Please try again — if the problem continues, contact support.</p>
      <button onClick={reset} className="btn-primary mt-4">
        Try again
      </button>
    </div>
  );
}
