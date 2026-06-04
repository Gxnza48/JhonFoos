"use client";

import { useCart } from "@/lib/cart";
import type { Settings } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { buildWhatsappLink, sanitizeWhatsapp } from "@/lib/whatsapp";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: Settings;
}

export default function CartDrawer({ open, onClose, settings }: Props) {
  const { items, total, count, setQty, removeItem, clear } = useCart();
  const symbol = settings.currency_symbol || "$";
  const hasNumber = sanitizeWhatsapp(settings.whatsapp_number).length >= 8;

  function checkout() {
    if (items.length === 0) return;
    const link = buildWhatsappLink(items, settings);
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={
          "fixed inset-0 z-50 bg-black/50 transition-opacity " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-brand text-lg font-700 uppercase tracking-widest">
            Tu pedido {count > 0 && <span className="text-neutral-400">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="text-2xl leading-none text-neutral-500 hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-neutral-400">
              Todavía no agregaste productos.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li
                  key={`${it.productId}-${it.size}`}
                  className="flex gap-3 border-b border-neutral-100 pb-4"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-neutral-200 bg-[#d9d9d9]">
                    {it.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-700 uppercase text-ink">{it.name}</p>
                    <p className="text-xs text-neutral-400">
                      Cod. {it.code} · Talle {it.size}
                    </p>
                    <p className="mt-0.5 text-sm font-600">
                      {formatPrice(it.unitPrice, symbol)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(it.productId, it.size, it.qty - 1)}
                        className="h-7 w-7 border border-neutral-300 text-sm font-600"
                        aria-label="Restar"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(it.productId, it.size, it.qty + 1)}
                        className="h-7 w-7 border border-neutral-300 text-sm font-600"
                        aria-label="Sumar"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(it.productId, it.size)}
                        className="ml-auto text-xs text-offer underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-sm font-700">
                    {formatPrice(it.unitPrice * it.qty, symbol)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-base font-700">
            <span>Total</span>
            <span>{formatPrice(total, symbol)}</span>
          </div>

          {!hasNumber && items.length > 0 && (
            <p className="mb-2 text-xs text-offer">
              ⚠ Falta configurar el número de WhatsApp en el panel de administración.
            </p>
          )}

          <button
            type="button"
            onClick={checkout}
            disabled={items.length === 0 || !hasNumber}
            className="flex w-full items-center justify-center gap-2 bg-[#1faf54] py-3.5 text-sm font-700 uppercase tracking-wider text-white transition hover:bg-[#1b9c4b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finalizar pedido por WhatsApp
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="mt-2 w-full text-center text-xs text-neutral-400 underline hover:text-neutral-600"
            >
              Vaciar carrito
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
