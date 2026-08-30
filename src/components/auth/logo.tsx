import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-serif text-lg font-semibold text-primary ${className}`}
    >
      <span aria-hidden className="text-xl">
        ✝
      </span>
      Meu Devocional
    </Link>
  );
}
