"use client";

interface Props {
  show: boolean;
  text: string;
}

export default function OfferBanner({ show, text }: Props) {
  if (!show || !text.trim()) return null;
  return (
    <div className="bg-offer text-white">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm font-600 uppercase tracking-wide">
        {text}
      </div>
    </div>
  );
}
