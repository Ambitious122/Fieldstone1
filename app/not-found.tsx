import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-fs flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-4xl">This page wandered off.</h1>
      <p className="max-w-sm text-stone-600">
        The page you're looking for doesn't exist or may have moved. Let's get you back on track.
      </p>
      <Link href="/" className="btn-primary mt-4">
        Back to home
      </Link>
    </div>
  );
}
