'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StoreProduct } from '@/lib/medusa/types';
import { useMedusa } from '@/lib/medusa/context';
import {
  X,
  ShoppingBag,
  Download,
  Scissors,
  Check,
  FileCheck,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface QuickViewModalProps {
  product: StoreProduct | null;
  onClose: () => void;
  onOpenMeasurements?: (product: StoreProduct) => void;
}

export function QuickViewModal({
  product,
  onClose,
  onOpenMeasurements,
}: QuickViewModalProps) {
  const { currentRegion, formatPrice, addItemToCart, customer } = useMedusa();
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currency = currentRegion.currency_code;
  const basePrice = product.base_prices[currency] || 0;
  const isB2B =
    product.product_type === 'digital_pattern' &&
    (customer.customer_group === 'Boutique' || customer.customer_group === 'Educator');
  const wholesalePrice = isB2B ? product.wholesale_prices?.[currency] : undefined;

  const handleAction = () => {
    if (product.product_type === 'physical_garment') {
      onClose();
      onOpenMeasurements?.(product);
      return;
    }
    addItemToCart(product);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-zinc-200 shadow-2xl max-w-3xl w-full overflow-hidden relative max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 hover:bg-white text-zinc-600 rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Left */}
        <div className="md:w-1/2 bg-zinc-100 flex flex-col justify-between p-4 relative min-h-[320px]">
          <div className="relative w-full h-72 sm:h-96 rounded-md overflow-hidden bg-zinc-200">
            <Image
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              referrerPolicy="no-referrer"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 pt-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-14 h-14 rounded-md overflow-hidden border cursor-pointer ${
                    selectedImage === idx ? 'border-zinc-950 ring-1 ring-zinc-950' : 'border-zinc-300 opacity-70'
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="60px"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Right */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-900 font-medium">
                {product.product_type === 'digital_pattern' ? 'Door 01 Digital' : 'Door 02 Atelier'}
              </span>
            </div>

            <h2 className="text-xl font-serif font-medium text-zinc-950">
              {product.title}
            </h2>

            {/* Pricing Section */}
            <div className="mt-2.5 pb-3 border-b border-zinc-100">
              {wholesalePrice !== undefined ? (
                <div>
                  <div className="text-xs text-zinc-400 line-through tabular-nums font-mono">
                    Regular: {formatPrice(basePrice)}
                  </div>
                  <div className="text-lg font-semibold text-emerald-800 tabular-nums font-mono flex items-center gap-2">
                    <span>{formatPrice(wholesalePrice)}</span>
                    <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-xs font-sans font-medium">
                      {customer.customer_group} 40% Wholesale
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-lg font-semibold text-zinc-950 tabular-nums font-mono">
                  {formatPrice(basePrice)}
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mt-3">
              {product.description}
            </p>

            {/* Door 01: Digital pattern specs */}
            {product.product_type === 'digital_pattern' && product.digital_details && (
              <div className="mt-4 p-3 bg-zinc-50 border border-zinc-200/70 rounded-md space-y-2 text-xs">
                <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Pattern Technical Specification</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600">
                  <div>
                    <span className="text-zinc-400">Grading Range:</span>{' '}
                    <strong className="text-zinc-800">{product.digital_details.grading_range}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400">Skill Level:</span>{' '}
                    <strong className="text-zinc-800">{product.digital_details.skill_level}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400">Included Formats:</span>{' '}
                    <strong className="text-zinc-800">A0, A4, US Letter, Projector</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400">Download Limit:</span>{' '}
                    <strong className="text-zinc-800">5 Signed S3 Tokens</strong>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-800 bg-emerald-50/80 p-2 rounded-xs">
                  Instant secure digital download access immediately post-purchase. No physical shipping charges.
                </div>
              </div>
            )}

            {/* Door 02: Physical atelier specs */}
            {product.product_type === 'physical_garment' && product.garment_details && (
              <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200/70 rounded-md space-y-2 text-xs">
                <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                  <span>Dhaka Atelier Provenance</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-700">
                  <div>
                    <span className="text-zinc-500">Textile Heritage:</span>{' '}
                    <strong className="text-amber-950">{product.garment_details.textile}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500">Weaving Origin:</span>{' '}
                    <strong className="text-zinc-900">{product.garment_details.origin}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500">Loom Weave Time:</span>{' '}
                    <strong className="text-zinc-900">{product.garment_details.weave_time_days} days</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500">Lead Time:</span>{' '}
                    <strong className="text-zinc-900">{product.garment_details.production_lead_time_weeks} weeks</strong>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-600 bg-white/70 p-2 rounded-xs border border-amber-200/40">
                  Includes full 7-stage Dhaka production tracking (Measurements Review → Textile Selection → Cutting → Stitching → QC → Shipping → Delivery).
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-5 mt-4 border-t border-zinc-100">
            <button
              onClick={handleAction}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag</span>
                </>
              ) : product.product_type === 'physical_garment' ? (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Configure Bespoke Measurements</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Pattern Suite to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
