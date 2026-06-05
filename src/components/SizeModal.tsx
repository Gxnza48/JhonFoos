"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";
import { effectivePrice, hasDiscount } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface Props {
  product: Product;
  currencySymbol: string;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}

export default function SizeModal({ product, currencySymbol, onClose, onAdd }: Props) {
  const sizes = useMemo(
    () => (product.sizes || []).filter((s) => s.stock > 0),
    [product]
  );
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const price = effectivePrice(product);
  const discounted = hasDiscount(product);
  const selectedSize = sizes.find((s) => s.size === size) || null;
  const maxQty = selectedSize?.stock ?? 1;

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Reajustar cantidad si supera el stock del talle elegido
  useEffect(() => {
    if (selectedSize && qty > selectedSize.stock) setQty(selectedSize.stock);
  }, [selectedSize, qty]);

  const canAdd = !!selectedSize && qty >= 1 && qty <= maxQty;

  function handleAdd() {
    if (!selectedSize) return;
    onAdd({
      productId: product.id,
      code: product.code,
      name: product.name,
      size: selectedSize.size,
      unitPrice: price,
      qty,
      stock: selectedSize.stock,
      imageUrl: product.image_url,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado producto */}
        <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:gap-6">
          <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden rounded-lg border border-line bg-neutral-100 sm:w-64">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 sm:flex sm:flex-col sm:justify-center">
            <p className="text-xs text-neutral-400">{product.code}</p>
            <p className="text-xl font-700 uppercase leading-tight text-ink sm:text-2xl">
              {product.name}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-700 text-ink">
                {formatPrice(price, currencySymbol)}
              </span>
              {discounted && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.price, currencySymbol)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Selección de talle */}
        <p className="mt-5 text-xs font-600 uppercase tracking-widest text-neutral-500">
          Seleccionar talle
        </p>

        {sizes.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Sin talles disponibles por ahora.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => {
              const active = size === s.size;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.size)}
                  className={
                    "flex min-w-[60px] flex-col items-center rounded-md border px-3 py-2 transition " +
                    (active
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink hover:border-neutral-400")
                  }
                >
                  <span className="text-base font-700 leading-none">{s.size}</span>
                  <span
                    className={
                      "mt-1 text-[10px] " + (active ? "text-white/70" : "text-neutral-400")
                    }
                  >
                    {s.stock} {s.stock === 1 ? "par" : "pares"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Cantidad */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-600 text-ink">Cantidad de pares</span>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={!selectedSize || qty <= 1}
              className="h-10 w-10 rounded-l-md border border-line text-lg font-600 text-ink transition hover:bg-neutral-50 disabled:opacity-40"
              aria-label="Restar"
            >
              −
            </button>
            <div className="flex h-10 w-12 items-center justify-center border-y border-line text-base font-600">
              {qty}
            </div>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              disabled={!selectedSize || qty >= maxQty}
              className="h-10 w-10 rounded-r-md border border-line text-lg font-600 text-ink transition hover:bg-neutral-50 disabled:opacity-40"
              aria-label="Sumar"
            >
              +
            </button>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line bg-white py-3 text-sm font-600 uppercase tracking-wider text-ink transition hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="rounded-md bg-ink py-3 text-sm font-600 uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
