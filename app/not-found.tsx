import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div>
        <div className="text-4xl font-bold mb-2">404</div>
        <p className="text-sm text-zinc-400 mb-4">That page hasn't been built yet.</p>
        <Link href="/" className="btn-primary inline-flex">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
