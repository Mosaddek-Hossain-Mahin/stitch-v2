'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AtelierTracker } from '@/components/AtelierTracker';
import { useMedusa } from '@/lib/medusa/context';
import {
  Scissors,
  Download,
  Package,
  Calendar,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export default function OrdersPage() {
  const { orders, formatPrice } = useMedusa();

  const physicalOrders = orders.filter((o) => o.has_physical_items);
  const digitalOnlyOrders = orders.filter((o) => !o.has_physical_items && o.has_digital_items);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
              <Package className="w-3.5 h-3.5" />
              <span>Customer Account & Commissions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-950 mb-2">
              Atelier Orders & Production Tracking
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Track the live artisanal lifecycle of your bespoke garments in our Dhaka atelier, or access your digital pattern download licenses.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center max-w-md mx-auto">
              <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-serif font-medium text-zinc-900 mb-1">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-zinc-500 mb-6">
                Discover our graded digital patterns or commission a bespoke garment in authentic Bangladeshi Jamdani, Muslin, Katan, or Endi silk.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors"
              >
                <span>Browse Sartorial Catalog</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Made-to-Order Physical Commissions with Active Atelier Trackers */}
              {physicalOrders.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                    <Scissors className="w-4 h-4 text-amber-800" />
                    <h2 className="text-base font-serif font-medium text-zinc-950">
                      Active Dhaka Made-to-Order Commissions ({physicalOrders.length})
                    </h2>
                  </div>

                  {physicalOrders.map((order) => (
                    <div key={order.id} className="space-y-4">
                      <AtelierTracker order={order} />

                      {/* Order items detail */}
                      <div className="bg-white border border-zinc-200 rounded-lg p-4 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-100 text-zinc-500 font-mono text-[11px]">
                          <span>Commission Total: {formatPrice(order.total)}</span>
                          <span>Payment: {order.payment_status.toUpperCase()}</span>
                        </div>
                        <div className="pt-2 space-y-1.5">
                          {order.items.map((it) => (
                            <div key={it.id} className="flex justify-between text-zinc-700">
                              <span>
                                {it.product_title}{' '}
                                {it.selected_textile && (
                                  <span className="text-amber-800">
                                    ({it.selected_textile})
                                  </span>
                                )}
                              </span>
                              <span className="font-mono text-zinc-900">
                                {formatPrice(it.total_price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Digital-only Orders */}
              {digitalOnlyOrders.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <h2 className="text-base font-serif font-medium text-zinc-950">
                      Digital Pattern Licenses ({digitalOnlyOrders.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {digitalOnlyOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                            <span>Order #{order.order_number}</span>
                            <span className="flex items-center gap-1 text-zinc-400">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            </span>
                          </div>
                          <div className="space-y-1 my-2">
                            {order.items.map((it) => (
                              <div key={it.id} className="text-xs font-medium text-zinc-900">
                                {it.product_title}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-zinc-900">
                            {formatPrice(order.total)}
                          </span>
                          <Link
                            href="/account/downloads"
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-950"
                          >
                            <span>Download Files</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
