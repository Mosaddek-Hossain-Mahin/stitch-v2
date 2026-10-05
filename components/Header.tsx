'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Globe, User, Menu, X, Check } from 'lucide-react';
import { useMedusa } from '@/lib/medusa/context';
import { STORE_REGIONS } from '@/lib/medusa/regions';

interface HeaderProps {
  onOpenB2BModal?: () => void;
}

export function Header({ onOpenB2BModal }: HeaderProps) {
  const { currentRegion, setRegion, cart, setIsCartOpen, customer } = useMedusa();
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Top promotional & trust bar - single line, quiet */}
      <div className="bg-[#18181B] text-[#E4E4E7] text-xs py-2 px-4 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] tracking-wide">
          <div className="flex items-center gap-3">
            <span>Dhaka Atelier & Graded Digital Patterns</span>
            <span className="text-[#71717A]" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-[#A1A1AA]">
              Bespoke Jamdani, Dhaka Muslin, Mirpur Katan & Endi Silk
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenB2BModal}
              suppressHydrationWarning
              className="text-[#D4D4D8] hover:text-white transition-colors underline decoration-[#52525B] underline-offset-4 cursor-pointer"
            >
              {customer.customer_group === 'Standard'
                ? 'B2B Wholesale Portal'
                : `${customer.customer_group} Tier Active (40% Off Patterns)`}
            </button>
            <span className="text-[#71717A]" aria-hidden="true">·</span>
            <div className="relative">
              <button
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                suppressHydrationWarning
                className="flex items-center gap-1.5 text-[#D4D4D8] hover:text-white transition-colors cursor-pointer"
                aria-label="Select Region and Currency"
              >
                <Globe className="w-3 h-3 text-[#A1A1AA]" />
                <span suppressHydrationWarning>
                  {currentRegion.name.split(' ')[0]} ({currentRegion.currency_symbol})
                </span>
              </button>

              {isRegionOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-zinc-900 border border-zinc-200 shadow-xl rounded-md py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 mb-1">
                    Select Commerce Region
                  </div>
                  {STORE_REGIONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRegion(r.id);
                        setIsRegionOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-50 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-zinc-800">{r.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          Currency: {r.currency_code} ({r.currency_symbol}) {r.tax_rate > 0 ? `· ${Math.round(r.tax_rate * 100)}% VAT` : ''}
                        </div>
                      </div>
                      {currentRegion.id === r.id && (
                        <Check className="w-3.5 h-3.5 text-zinc-900" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Top Bar Contract: Brand Wordmark | Nav Links | Primary Actions */}
      <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand wordmark attached with official logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-95 transition-opacity shrink-0 group"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-black ring-1 ring-zinc-900/10 shadow-xs shrink-0">
              <Image
                src="/images/logo.png"
                alt="Stitch BD Fashion Logo"
                fill
                priority
                className="object-cover"
                sizes="40px"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xl sm:text-2xl font-serif tracking-tight text-zinc-950 font-normal">
                  Stitch
                </span>
                <span className="text-lg sm:text-xl font-sans font-bold tracking-tight text-red-600">
                  BD
                </span>
              </div>
              <span className="text-[9px] font-sans uppercase tracking-[0.22em] text-zinc-500 font-semibold mt-0.5">
                Fashion · Atelier
              </span>
            </div>
          </Link>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-700">
            <Link
              href="/#patterns"
              className="hover:text-zinc-950 transition-colors py-1 hover:border-b hover:border-zinc-900"
            >
              Digital Patterns
            </Link>
            <Link
              href="/#garments"
              className="hover:text-zinc-950 transition-colors py-1 hover:border-b hover:border-zinc-900"
            >
              Atelier Garments
            </Link>
            <Link
              href="/#textiles"
              className="hover:text-zinc-950 transition-colors py-1 hover:border-b hover:border-zinc-900"
            >
              Heritage Textiles
            </Link>
            <Link
              href="/#lifecycle"
              className="hover:text-zinc-950 transition-colors py-1 hover:border-b hover:border-zinc-900"
            >
              Production Lifecycle
            </Link>
            <Link
              href="/account/downloads"
              className="hover:text-zinc-950 transition-colors py-1 hover:border-b hover:border-zinc-900"
            >
              My Downloads
            </Link>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/account/orders"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 transition-colors px-2 py-1.5 rounded-sm"
              title="Account & Atelier Orders"
            >
              <User className="w-4 h-4 text-zinc-700" />
              <span className="hidden lg:inline text-xs font-medium">Orders & Atelier</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              suppressHydrationWarning
              className="relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-md transition-all cursor-pointer shadow-xs"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-200" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartCount > 0 && (
                <span suppressHydrationWarning className="inline-flex items-center justify-center bg-white text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-700 hover:text-zinc-950 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3 shadow-lg">
            <Link
              href="/#patterns"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 py-1.5"
            >
              Digital Patterns (XS–5XL)
            </Link>
            <Link
              href="/#garments"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 py-1.5"
            >
              Atelier Garments (Dhaka)
            </Link>
            <Link
              href="/#textiles"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 py-1.5"
            >
              Heritage Bangladeshi Textiles
            </Link>
            <Link
              href="/#lifecycle"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 py-1.5"
            >
              Atelier Production Lifecycle
            </Link>
            <Link
              href="/account/downloads"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 py-1.5"
            >
              Secure S3 Pattern Downloads
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-800 py-1.5"
            >
              Order History & Tracking
            </Link>
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs text-zinc-500">B2B Wholesale</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenB2BModal?.();
                }}
                className="text-xs font-medium text-zinc-900 underline"
              >
                Configure Customer Tier
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
