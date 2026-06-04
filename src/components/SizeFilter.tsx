"use client";

interface Props {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string | null) => void;
}

export default function SizeFilter({ sizes, selected, onSelect }: Props) {
  if (sizes.length === 0) return null;
  return (
    <div className="bg-[#6f6f6f]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
        <span className="mr-1 text-xs font-600 uppercase tracking-widest text-white/80">
          Talle:
        </span>
        {sizes.map((s) => {
          const active = selected === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelect(active ? null : s)}
              className={
                "min-w-[42px] rounded border px-3 py-1.5 text-sm font-600 transition " +
                (active
                  ? "border-white bg-white text-ink"
                  : "border-white/40 bg-transparent text-white hover:bg-white/10")
              }
            >
              {s}
            </button>
          );
        })}
        {selected && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="ml-1 text-xs uppercase tracking-wide text-white/70 underline hover:text-white"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
