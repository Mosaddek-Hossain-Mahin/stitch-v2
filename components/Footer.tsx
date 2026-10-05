'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[#18181B] text-[#A1A1AA] pt-16 pb-12 border-t border-[#27272A] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#27272A]">
          {/* Col 1: Wordmark & Logo */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-black ring-1 ring-zinc-700 shadow-md shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Stitch BD Fashion Logo"
                  fill
                  className="object-cover"
                  sizes="44px"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-xl font-serif tracking-tight text-white font-normal">
                    Stitch
                  </span>
                  <span className="text-lg font-sans font-bold tracking-tight text-red-500">
                    BD
                  </span>
                </div>
                <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-zinc-400 font-semibold mt-1">
                  Fashion · Dhaka Atelier
                </span>
              </div>
            </Link>
            <p className="text-xs text-[#A1A1AA] leading-relaxed pr-4">
              Two business doors united by sartorial integrity: multi-graded digital sewing patterns with secure S3 access, and made-to-order garments hand-tailored in Dhaka from historic Bangladeshi textiles.
            </p>
            <div className="pt-2 text-[11px] text-[#71717A]">
              Atelier: Demra & Mirpur Weavers Cluster, Dhaka, Bangladesh
            </div>
          </div>

          {/* Col 2: Door 01 — Graded Digital Patterns */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Graded Patterns (XS–5XL)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#patterns" className="hover:text-white transition-colors">
                  A0 Copy-Shop Multi-page PDF
                </Link>
              </li>
              <li>
                <Link href="/#patterns" className="hover:text-white transition-colors">
                  A4 & US Letter Home Print
                </Link>
              </li>
              <li>
                <Link href="/#patterns" className="hover:text-white transition-colors">
                  Layered Projector Files
                </Link>
              </li>
              <li>
                <Link href="/account/downloads" className="hover:text-white transition-colors">
                  Signed S3 Download Portal
                </Link>
              </li>
              <li>
                <span className="text-[#71717A]">Max 5 Verified Downloads per License</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Door 02 — Made-to-Order Atelier */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Dhaka Atelier & Textiles
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#textiles" className="hover:text-white transition-colors">
                  Hand-loomed Jamdani (Demra)
                </Link>
              </li>
              <li>
                <Link href="/#textiles" className="hover:text-white transition-colors">
                  Revived Dhaka Muslin (Meghna)
                </Link>
              </li>
              <li>
                <Link href="/#textiles" className="hover:text-white transition-colors">
                  Mirpur Katan Pure Brocade
                </Link>
              </li>
              <li>
                <Link href="/#textiles" className="hover:text-white transition-colors">
                  Rajshahi Wild Endi Peace Silk
                </Link>
              </li>
              <li>
                <Link href="/#lifecycle" className="hover:text-white transition-colors">
                  7-Stage Production Lifecycle
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Multi-Region Commerce & B2B */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Commerce & Policy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[#E4E4E7]">Bangladesh: Domestic VAT 5% & COD</span>
              </li>
              <li>
                <span className="text-[#E4E4E7]">International: USD / GBP / EUR / SGD</span>
              </li>
              <li>
                <span className="text-[#E4E4E7]">B2B: 40% Tier for Boutique & Educators</span>
              </li>
              <li>
                <span className="text-[#71717A]">Medusa v2 Authoritative Pricing Engine</span>
              </li>
              <li>
                <span className="text-[#71717A]">Zero Plastic Fabric Sourcing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclosures */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71717A] gap-4">
          <div>
            © {new Date().getFullYear()} Stitch BD. All rights reserved. Dhaka Artisanal Tailoring & Graded Patternmaking.
          </div>
          <div className="flex items-center gap-4">
            <span>Domestic Courier: Dhaka Metropolis & Nationwide</span>
            <span aria-hidden="true">·</span>
            <span>DHL Express Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
