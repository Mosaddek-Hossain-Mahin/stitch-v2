'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { useMedusa } from '@/lib/medusa/context';

interface CartDrawerProps {
  onProceedToCheckout?: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartItemQuantity,
    removeCartItem,
    formatPrice,
    customer,
  } = useMedusa();

  if (!isCartOpen) return null;

  const hasPhysical = cart.has_physical_items;
  const hasDigital = cart.has_digital_items;
  const isMixed = hasPhysical && hasDigital;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div>
              <h2 className="text-base font-serif font-medium text-zinc-950">
                Your Sartorial Bag
              </h2>
              <div className="text-xs text-zinc-500 mt-0.5">
                {cart.items.length === 0
                  ? 'Bag is currently empty'
                  : `${cart.items.reduce((s, i) => s + i.quantity, 0)} item${
                      cart.items.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''
                    } · ${cart.region.name}`}
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mixed Cart Notice Banner */}
          {cart.items.length > 0 && (
            <div className="px-5 py-3 bg-zinc-100/90 border-b border-zinc-200 text-xs text-zinc-700">
              {isMixed ? (
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900">Mixed Cart Detected:</span>{' '}
                    Your digital patterns receive instant S3 download links, while physical atelier garments will be custom crafted in Dhaka with tracked shipping.
                  </div>
                </div>
              ) : hasDigital ? (
                <div className="flex items-start gap-2">
                  <Download className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900">Digital-Only Order:</span>{' '}
                    Instant secure access via signed S3 links post-checkout. No shipping fee required.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900">Made-to-Order Atelier:</span>{' '}
                    Custom handcrafted in Dhaka using authentic heritage Bangladeshi textiles.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
                  <ShoppingBagIcon />
                </div>
                <h3 className="text-base font-serif font-medium text-zinc-900 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Explore our graded sewing pattern blueprints or discover bespoke made-to-order garments from our Dhaka atelier.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      window.location.hash = 'patterns';
                    }}
                    className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Explore Graded Patterns (XS–5XL)
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      window.location.hash = 'garments';
                    }}
                    className="w-full py-2 px-4 border border-zinc-300 hover:border-zinc-900 text-zinc-800 text-xs font-medium rounded-md transition-colors cursor-pointer"
                  >
                    View Dhaka Atelier Garments
                  </button>
                </div>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 border border-zinc-200 rounded-lg bg-white relative transition-shadow hover:shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-zinc-100 rounded-md overflow-hidden relative shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Quiet unboxed text tag separator */}
                      <div className="flex items-center gap-1.5 text-[10px] tracking-wider font-semibold uppercase text-zinc-500 mb-1">
                        <span>
                          {item.product_type === 'digital_pattern'
                            ? 'DIGITAL · INSTANT ACCESS'
                            : 'PHYSICAL · DHAKA ATELIER'}
                        </span>
                        {item.selected_textile && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-800 font-normal">
                              {item.selected_textile}
                            </span>
                          </>
                        )}
                      </div>

                      <h4 className="text-xs font-medium text-zinc-900 line-clamp-1">
                        {item.product_title}
                      </h4>

                      {/* Pattern format details */}
                      {item.product_type === 'digital_pattern' && (
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          Multi-format Suite (A0 Copy-Shop · A4 · US Letter · Projector)
                        </div>
                      )}

                      {/* Physical bespoke details */}
                      {item.product_type === 'physical_garment' && item.measurements && (
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          Bespoke Fit: Bust {item.measurements.bust}&quot; · Waist {item.measurements.waist}&quot;
                        </div>
                      )}

                      {/* B2B wholesale pricing badge if applicable */}
                      {item.is_b2b_discounted && (
                        <div className="text-[10px] text-emerald-700 font-medium mt-1">
                          {item.discount_label || '40% Wholesale Price Applied'}
                        </div>
                      )}
                    </div>

                    {/* Price and quantity row */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-2">
                      <div className="flex items-center gap-2">
                        {item.product_type === 'physical_garment' ? (
                          <div className="flex items-center border border-zinc-200 rounded-md">
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono tabular-nums text-zinc-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-500 font-mono">
                            Qty: 1 license
                          </span>
                        )}

                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        {item.is_b2b_discounted && (
                          <div className="text-[10px] text-zinc-400 line-through tabular-nums font-mono">
                            {formatPrice(item.original_unit_price * item.quantity)}
                          </div>
                        )}
                        <div className="text-xs font-semibold text-zinc-900 tabular-nums font-mono">
                          {formatPrice(item.total_price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Summary */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-mono text-zinc-900">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                {cart.region.tax_rate > 0 && (
                  <div className="flex justify-between text-zinc-600">
                    <span>{cart.region.tax_label}</span>
                    <span className="tabular-nums font-mono text-zinc-900">
                      {formatPrice(cart.tax_total)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span className="tabular-nums font-mono text-zinc-900">
                    {hasPhysical ? (
                      formatPrice(cart.shipping_total)
                    ) : (
                      <span className="text-emerald-700 font-medium">Free (Digital Delivery)</span>
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-semibold text-zinc-950">
                  <span>Total</span>
                  <span className="tabular-nums font-mono">{formatPrice(cart.total)}</span>
                </div>
              </div>

              {customer.customer_group !== 'Standard' && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-md">
                  Active B2B Tier: <strong>{customer.customer_group}</strong> (40% discount reflected via Medusa price list).
                </div>
              )}

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  if (onProceedToCheckout) {
                    onProceedToCheckout();
                  } else {
                    window.location.href = '/checkout';
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-center text-zinc-500">
                All prices and regional taxes authoritative via MedusaJS engine.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}
