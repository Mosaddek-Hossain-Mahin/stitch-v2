'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { DigitalDownloadCenter } from '@/components/DigitalDownloadCenter';
import { Download, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-zinc-600 bg-white px-3 py-1.5 rounded-md border border-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Encrypted S3 Token System</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
              <Download className="w-3.5 h-3.5" />
              <span>Door 01 — Graded Digital Pattern Licensing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-950 mb-2">
              My Digital Downloads Vault
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Your purchased sewing patterns are stored securely with pre-signed Amazon S3 download URLs. Each license permits up to 5 verified downloads across all supported formats (A0 Copy-Shop, A4 Print-at-Home, US Letter, and Layered Projector files).
            </p>
          </div>

          <DigitalDownloadCenter />
        </div>
      </main>

      <Footer />
    </div>
  );
}
