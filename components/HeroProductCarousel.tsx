'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { StoreProduct } from '@/lib/medusa/types';
import { useMedusa } from '@/lib/medusa/context';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Scissors,
  Eye,
  ShoppingBag,
  Sparkles,
  Check,
} from 'lucide-react';

interface HeroProductCarouselProps {
  products: StoreProduct[];
  onOpenQuickView: (product: StoreProduct) => void;
  onOpenCustomMeasurements: (product: StoreProduct) => void;
}

export function HeroProductCarousel({
  products,
  onOpenQuickView,
  onOpenCustomMeasurements,
}: HeroProductCarouselProps) {
  const { formatPrice, addItemToCart, currentRegion } = useMedusa();

  // Curate featured showcase items across categories
  const showcaseItems = products.length > 0 ? products : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [added, setAdded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProduct = showcaseItems[currentIndex] || null;

  // Auto-advance carousel
  useEffect(() => {
    if (showcaseItems.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showcaseItems.length, isPaused]);

  if (!activeProduct) {
    return (
      <div className="relative aspect-4/3 sm:aspect-1/1 rounded-xl overflow-hidden shadow-lg border border-zinc-200/90 bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
        Loading Sartorial Showcase...
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? showcaseItems.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeProduct.product_type === 'physical_garment') {
      onOpenCustomMeasurements(activeProduct);
    } else {
      addItemToCart(activeProduct);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  const currency = currentRegion.currency_code;
  const currentPrice = activeProduct.base_prices[currency] || 0;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative aspect-4/3 sm:aspect-1/1 rounded-xl overflow-hidden shadow-lg border border-zinc-200/90 bg-zinc-950 group select-none"
    >
      {/* Background Image Slide with smooth fade */}
      <div className="relative w-full h-full">
        <Image
          key={activeProduct.id}
          src={activeProduct.thumbnail || '/images/hero.jpg'}
          alt={activeProduct.title}
          fill
          priority
          className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-103"
          sizes="(max-width: 1024px) 100vw, 42vw"
          referrerPolicy="no-referrer"
        />

        {/* Contrast Scrim gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
      </div>

      {/* Top Category Badge & Switcher Strip */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-white shadow-xs">
          {activeProduct.product_type === 'digital_pattern' ? (
            <>
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium tracking-wide">
                Door 01 · Digital Pattern (XS–5XL)
              </span>
            </>
          ) : (
            <>
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-medium tracking-wide">
                Door 02 · {activeProduct.garment_details?.textile || 'Atelier Garment'}
              </span>
            </>
          )}
        </div>

        {/* Slide Counter */}
        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-white/90 text-[10px] font-mono tabular-nums">
          {currentIndex + 1} / {showcaseItems.length}
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={handlePrev}
        aria-label="Previous product"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md backdrop-blur-xs opacity-80 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next product"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md backdrop-blur-xs opacity-80 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Category Pills Quick Jump Bar */}
      <div className="absolute top-12 left-3.5 right-3.5 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {showcaseItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer backdrop-blur-md ${
              currentIndex === idx
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'bg-black/50 text-white/80 hover:bg-black/80 hover:text-white border border-white/10'
            }`}
          >
            {item.product_type === 'digital_pattern' ? 'Pattern' : item.garment_details?.textile || 'Atelier'}
          </button>
        ))}
      </div>

      {/* Bottom Product Details Card Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/40 shadow-xl text-zinc-900 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-900 mb-0.5">
              <Sparkles className="w-3 h-3 text-amber-800" />
              <span>
                {activeProduct.product_type === 'digital_pattern'
                  ? 'Graded PDF Suite · Layered Print'
                  : `Made-to-Order · ${activeProduct.garment_details?.origin || 'Dhaka Atelier'}`}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-serif font-medium text-zinc-950 truncate">
              {activeProduct.title}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs sm:text-sm font-semibold text-zinc-950 font-mono tabular-nums">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-[10px] text-zinc-500 font-sans">
                {activeProduct.product_type === 'digital_pattern'
                  ? '· 5 S3 Downloads'
                  : '· Hand-Tailored Bespoke'}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuickView(activeProduct);
              }}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              title="Inspect specifications"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Details</span>
            </button>

            <button
              onClick={handleAction}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                added
                  ? 'bg-emerald-800 text-white'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : activeProduct.product_type === 'physical_garment' ? (
                <>
                  <Scissors className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tailor</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Carousel Progress Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-zinc-200/60">
          {showcaseItems.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(dotIdx);
              }}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === dotIdx
                  ? 'w-6 bg-zinc-950'
                  : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
