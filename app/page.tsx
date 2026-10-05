'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMedusa } from '@/lib/medusa/context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { MeasurementsModal } from '@/components/MeasurementsModal';
import { B2BWholesalePortal } from '@/components/B2BWholesalePortal';
import { HeritageTextilesSection } from '@/components/HeritageTextilesSection';
import { AtelierTracker } from '@/components/AtelierTracker';
import { HeroProductCarousel } from '@/components/HeroProductCarousel';
import { StoreProduct, GarmentTextile } from '@/lib/medusa/types';
import { medusa } from '@/lib/medusa/client';
import {
  Download,
  Scissors,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Search,
  Filter,
} from 'lucide-react';

export default function HomePage() {
  const { currentRegion, formatPrice, customer, orders } = useMedusa();

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
  const [measurementsProduct, setMeasurementsProduct] = useState<StoreProduct | null>(null);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'all' | 'patterns' | 'garments'>('all');
  const [textileFilter, setTextileFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load products from Medusa Store API client
  useEffect(() => {
    async function load() {
      const items = await medusa.products.list();
      setProducts(items);
    }
    load();
  }, []);

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'patterns' && p.product_type !== 'digital_pattern') return false;
    if (activeTab === 'garments' && p.product_type !== 'physical_garment') return false;
    if (
      textileFilter !== 'all' &&
      p.garment_details?.textile.toLowerCase() !== textileFilter.toLowerCase()
    ) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const patterns = filteredProducts.filter((p) => p.product_type === 'digital_pattern');
  const garments = filteredProducts.filter((p) => p.product_type === 'physical_garment');

  // Find latest atelier order for live lifecycle demo banner
  const activePhysicalOrder = orders.find((o) => o.has_physical_items);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      {/* Top Header */}
      <Header onOpenB2BModal={() => setIsB2BModalOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          window.location.href = '/checkout';
        }}
      />

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenMeasurements={(prod) => {
          setQuickViewProduct(null);
          setMeasurementsProduct(prod);
        }}
      />

      <MeasurementsModal
        isOpen={!!measurementsProduct}
        product={measurementsProduct}
        onClose={() => setMeasurementsProduct(null)}
      />

      <B2BWholesalePortal
        isOpen={isB2BModalOpen}
        onClose={() => setIsB2BModalOpen(false)}
      />

      <main className="flex-1">
        {/* HERO SECTION — Clean, Architectural, Editorial */}
        <section className="relative border-b border-zinc-200/80 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Editorial Copy (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Brand emblem kicker */}
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900 text-white text-xs shadow-xs w-fit">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-zinc-700">
                    <Image
                      src="/images/logo.png"
                      alt="Stitch BD"
                      fill
                      className="object-cover"
                      sizes="20px"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-serif tracking-wide text-zinc-100 font-medium">Stitch BD Fashion</span>
                  <span className="text-zinc-600" aria-hidden="true">·</span>
                  <span className="text-zinc-300 text-[11px] font-sans">Dhaka Atelier & Graded Patterns</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-zinc-950 tracking-tight leading-[1.08] text-balance">
                  Graded Digital Blueprints & Made-to-Order Dhaka Atelier.
                </h1>

                <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
                  Stitch BD unites modern multi-size digital pattern engineering (XS–5XL with layered A0, A4 & projector files) with bespoke made-to-order commissions hand-tailored from Jamdani, Dhaka Muslin, Mirpur Katan, and Rajshahi wild Endi silk.
                </p>

                {/* Two Main Business Doors Quick Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Door 01 */}
                  <a
                    href="#patterns"
                    className="p-4 rounded-lg border border-zinc-200 bg-[#FDFBF7] hover:border-zinc-900 transition-all group block"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 mb-1">
                      <Download className="w-4 h-4 text-zinc-700" />
                      <span>Door 01 — Graded Patterns</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-normal">
                      Instant signed S3 delivery. Multi-graded XS–5XL with layered printing. Zero physical shipping.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 mt-2.5 group-hover:underline">
                      <span>Explore Pattern Blueprints</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  {/* Door 02 */}
                  <a
                    href="#garments"
                    className="p-4 rounded-lg border border-zinc-200 bg-[#FDFBF7] hover:border-zinc-900 transition-all group block"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 mb-1">
                      <Scissors className="w-4 h-4 text-amber-800" />
                      <span>Door 02 — Dhaka Atelier</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-normal">
                      Bespoke anatomical cut. Jamdani, Muslin & Endi silk with 7-stage production tracking.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 mt-2.5 group-hover:underline">
                      <span>Commission Made-to-Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>

                {/* Regional Trust Marker */}
                <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Medusa v2 Authoritative Regional Pricing ({currentRegion.currency_code})</span>
                  </div>
                  <span aria-hidden="true" className="text-zinc-300">·</span>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>5 Signed S3 Pattern Downloads per License</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Interactive Carousel (5 cols) */}
              <div className="lg:col-span-5 relative">
                <HeroProductCarousel
                  products={products}
                  onOpenQuickView={(p) => setQuickViewProduct(p)}
                  onOpenCustomMeasurements={(p) => setMeasurementsProduct(p)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE ATELIER ORDER TRACKER (if physical order exists in session) */}
        {activePhysicalOrder && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12 relative z-20">
            <AtelierTracker order={activePhysicalOrder} />
          </section>
        )}

        {/* CATALOG BROWSER & NAVIGATION BAR */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-zinc-200/70 p-1 rounded-lg">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setTextileFilter('all');
                }}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                All Sartorial Works ({products.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('patterns');
                  setTextileFilter('all');
                }}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === 'patterns'
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Digital Patterns (XS–5XL)
              </button>
              <button
                onClick={() => setActiveTab('garments')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === 'garments'
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Made-to-Order Atelier Garments
              </button>
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patterns or textiles..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Textile Filter Pills (only when looking at garments or all) */}
          {activeTab !== 'patterns' && (
            <div className="flex items-center gap-2 pt-4 overflow-x-auto text-xs">
              <span className="text-zinc-500 font-medium shrink-0">Textile Filter:</span>
              {(['all', 'Jamdani', 'Dhaka Muslin', 'Mirpur Katan', 'Rajshahi wild Endi silk'] as const).map(
                (textile) => (
                  <button
                    key={textile}
                    onClick={() => setTextileFilter(textile)}
                    className={`px-3 py-1 rounded-md text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      textileFilter === textile
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {textile === 'all' ? 'All Heritage Weaves' : textile}
                  </button>
                )
              )}
            </div>
          )}
        </section>

        {/* DOOR 01: GRADED DIGITAL PATTERNS SECTION */}
        {(activeTab === 'all' || activeTab === 'patterns') && patterns.length > 0 && (
          <section id="patterns" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-200/60">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Door 01 — Graded Digital Patterns</span>
                </div>
                <h2 className="text-2xl font-serif font-medium text-zinc-950">
                  Technical Pattern Blueprints (XS–5XL Graded)
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Engineered with calibrated seam allowances. Every pattern includes A0 copy-shop, A4, US Letter, and layered projector files with 5 signed S3 downloads per license.
                </p>
              </div>

              {customer.customer_group !== 'Standard' && (
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                    {customer.customer_group} Tier: 40% Wholesale Applied
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {patterns.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* DOOR 02: MADE-TO-ORDER ATELIER SECTION */}
        {(activeTab === 'all' || activeTab === 'garments') && garments.length > 0 && (
          <section id="garments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-200/60">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-0.5">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Door 02 — Made-to-Order Atelier</span>
                </div>
                <h2 className="text-2xl font-serif font-medium text-zinc-950">
                  Dhaka Atelier Commissions (Heritage Bangladeshi Textiles)
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Hand-cut to your personal anatomical measurements. Woven on pit looms in Demra, Mirpur, and Rajshahi. Track your order through our 7-stage tailoring lifecycle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {garments.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={(p) => setQuickViewProduct(p)}
                  onOpenCustomMeasurements={(p) => setMeasurementsProduct(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* HERITAGE BANGLADESHI TEXTILES DEEP DIVE */}
        <HeritageTextilesSection
          onSelectTextileFilter={(textile) => {
            setActiveTab('garments');
            setTextileFilter(textile);
          }}
        />

        {/* PRODUCTION LIFECYCLE SPOTLIGHT */}
        <section id="lifecycle" className="py-20 bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
                <Scissors className="w-3.5 h-3.5" />
                <span>Transparent Bespoke Workflow</span>
              </div>
              <h2 className="text-3xl font-serif font-normal text-zinc-950">
                The 7-Stage Dhaka Atelier Lifecycle
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                Made-to-order garments are not off-the-shelf inventory. Each commission progresses through our artisanal Dhaka workshop with customer transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
              {[
                { stage: '1. Audit', title: 'Measurements', desc: 'Master patternmaker verifies anatomical ease.' },
                { stage: '2. Sourcing', title: 'Textile Prep', desc: 'Handwoven cloth pre-shrunk in mineral water.' },
                { stage: '3. Cutting', title: 'Master Cut', desc: 'Aligning geometric zari and weft motifs.' },
                { stage: '4. Tailoring', title: 'Stitching', desc: 'French seams & silk thread edge finish.' },
                { stage: '5. Inspection', title: 'Quality (QC)', desc: 'Tolerance audit (±2mm) & steam pressing.' },
                { stage: '6. Courier', title: 'Dispatch', desc: 'Wrapped in organic mulberry bark paper.' },
                { stage: '7. Receipt', title: 'Delivery', desc: 'Delivered to your doorstep worldwide.' },
              ].map((step, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 bg-[#FDFBF7] border border-zinc-200 rounded-lg flex flex-col justify-between"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1">
                    {step.stage}
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-900 mb-1">{step.title}</h4>
                  <p className="text-[11px] text-zinc-500 leading-normal">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S3 SECURE DOWNLOAD VAULT CALLOUT BANNER */}
        <section className="bg-[#18181B] text-white py-14 border-t border-[#27272A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <Download className="w-4 h-4" />
                <span>Secure Digital Licensing Infrastructure</span>
              </div>
              <h3 className="text-2xl font-serif font-medium text-white">
                Already commissioned or bought patterns?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Access your encrypted S3 download tokens, track atelier garment production stages, or update your saved bespoke anatomical measurements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/account/downloads"
                className="py-2.5 px-5 bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-zinc-800" />
                <span>My S3 Downloads Vault</span>
              </Link>
              <Link
                href="/account/orders"
                className="py-2.5 px-5 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white text-xs font-medium rounded-md transition-colors flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                <span>Track Atelier Orders</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
