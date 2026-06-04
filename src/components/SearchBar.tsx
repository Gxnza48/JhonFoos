"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="bg-[#7c7c7c]">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar modelo..."
          aria-label="Buscar modelo"
          className="w-full rounded bg-[#8a8a8a] px-4 py-2.5 text-white placeholder-white/70 outline-none ring-0 focus:bg-[#929292]"
        />
      </div>
    </div>
  );
}
