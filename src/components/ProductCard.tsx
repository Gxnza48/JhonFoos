"use client";

import type { Product } from "@/lib/types";
import { effectivePrice, hasDiscount } from "@/lib/types";
import { formatPrice } from "@/lib/format";

function CameraIcon() {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

interface Props {
  product: Product;
  currencySymbol: string;
  onOpen: (p: Product) => void;
}

export default function ProductCard({ product, currencySymbol, onOpen }: Props) {
  const price = effectivePrice(product);
  const discounted = hasDiscount(product);

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="group relative block w-full text-left"
    >
      {product.is_offer && (
        <span className="absolute left-0 top-0 z-10 bg-offer px-2.5 py-1 text-[11px] font-700 uppercase tracking-wider text-white">
          Oferta
        </span>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-[#cfcfcf]">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-placeholder">
            <CameraIcon />
            <span className="mt-2 text-xs uppercase tracking-widest">Sin foto</span>
          </div>
        )}
      </div>

      <div className="bg-white px-3 py-3">
        <p className="text-[11px] text-neutral-400">{product.code}</p>
        <p className="mt-0.5 truncate text-sm font-700 uppercase text-ink" title={product.name}>
          {product.name}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-700 text-ink">
            {formatPrice(price, currencySymbol)}
          </span>
          {discounted && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.price, currencySymbol)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
