'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutFlow } from '@/components/CheckoutFlow';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              Storefront
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-900 font-medium">Authoritative Checkout</span>
          </div>
        </div>

        <CheckoutFlow
          onCancel={() => {
            window.location.href = '/';
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
