'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StoreProduct } from '@/lib/medusa/types';
import { useMedusa } from '@/lib/medusa/context';
import { ShoppingBag, Eye, Heart, Download, Scissors, Check } from 'lucide-react';

interface ProductCardProps {
  product: StoreProduct;
  onOpenQuickView?: (product: StoreProduct) => void;
  onOpenCustomMeasurements?: (product: StoreProduct) => void;
}

export function ProductCard({
  product,
  onOpenQuickView,
  onOpenCustomMeasurements,
}: ProductCardProps) {
  const { currentRegion, addItemToCart, formatPrice, customer, wishlist, toggleWishlist } = useMedusa();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currency = currentRegion.currency_code;
  const basePrice = product.base_prices[currency] || 0;
  const isB2BEligible =
    product.product_type === 'digital_pattern' &&
    (customer.customer_group === 'Boutique' || customer.customer_group === 'Educator');
  const wholesalePrice = isB2BEligible ? product.wholesale_prices?.[currency] : undefined;

  const isFavorited = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (product.product_type === 'physical_garment') {
      // For physical garments, trigger measurements configuration or add with default measurements
      if (onOpenCustomMeasurements) {
        onOpenCustomMeasurements(product);
        return;
      }
    }

    addItemToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-zinc-200/90 rounded-lg overflow-hidden transition-all duration-200 hover:border-zinc-400 hover:shadow-sm">
      {/* Image container with 4:3 or 3:4 aspect ratio */}
      <div className="relative aspect-4/3 w-full bg-[#F4F4F5] overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          referrerPolicy="no-referrer"
        />

        {/* Top unboxed text badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-sm text-[11px] font-medium tracking-wide text-zinc-900 border border-zinc-200/60 shadow-xs">
            {product.product_type === 'digital_pattern' ? (
              <span className="flex items-center gap-1.5 text-zinc-800">
                <Download className="w-3 h-3 text-zinc-700" />
                <span>Pattern · XS–5XL</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-zinc-900 font-semibold">
                <Scissors className="w-3 h-3 text-amber-800" />
                <span>Atelier Bespoke</span>
              </span>
            )}
          </div>

          {/* Wishlist toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="pointer-events-auto p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-zinc-950 transition-colors shadow-xs cursor-pointer"
            aria-label="Save to wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorited ? 'fill-red-600 text-red-600' : ''
              }`}
            />
          </button>
        </div>

        {/* Quick View Button overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => onOpenQuickView?.(product)}
            className="flex-1 py-1.5 px-3 bg-white/95 backdrop-blur-xs hover:bg-white text-zinc-900 text-xs font-medium rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Sartorial Details</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1.5">
            {product.product_type === 'digital_pattern' ? (
              <>
                <span>Graded PDF Suite</span>
                <span aria-hidden="true">·</span>
                <span>Layered A0/A4/Projector</span>
              </>
            ) : (
              <>
                <span className="font-medium text-amber-900">
                  {product.garment_details?.textile}
                </span>
                <span aria-hidden="true">·</span>
                <span>Hand-loomed in Dhaka</span>
              </>
            )}
          </div>

          <h3 className="text-sm font-medium text-zinc-950 line-clamp-1 group-hover:text-zinc-800">
            {product.title}
          </h3>

          <p className="text-xs text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
            {product.subtitle || product.description}
          </p>
        </div>

        {/* Price and Action Row */}
        <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            {wholesalePrice !== undefined ? (
              <div>
                <div className="text-[10px] text-zinc-400 line-through tabular-nums font-mono">
                  {formatPrice(basePrice)}
                </div>
                <div className="text-sm font-semibold text-emerald-800 tabular-nums font-mono flex items-center gap-1">
                  <span>{formatPrice(wholesalePrice)}</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-sans font-medium">
                    B2B Tier
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm font-semibold text-zinc-950 tabular-nums font-mono">
                {formatPrice(basePrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-800 text-white'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.product_type === 'physical_garment' ? (
              <>
                <Scissors className="w-3.5 h-3.5" />
                <span>Tailor Bespoke</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Pattern</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
