"use client";

interface Props {
  name: string;
  subtitle: string;
}

export default function Header({ name, subtitle }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 text-center">
        <h1 className="font-brand text-2xl font-700 uppercase tracking-[0.35em] sm:text-3xl">
          {name}
        </h1>
        <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-white/55">
          {subtitle}
        </p>
      </div>
    </header>
  );
}
