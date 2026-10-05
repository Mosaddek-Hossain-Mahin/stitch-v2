'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMedusa } from '@/lib/medusa/context';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  Scissors,
  Download,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { AtelierOrder } from '@/lib/medusa/types';

interface CheckoutFlowProps {
  onOrderCompleted?: (order: AtelierOrder) => void;
  onCancel?: () => void;
}

export function CheckoutFlow({ onOrderCompleted, onCancel }: CheckoutFlowProps) {
  const { cart, currentRegion, formatPrice, placeOrder, customer } = useMedusa();

  const [customerName, setCustomerName] = useState(
    `${customer.first_name} ${customer.last_name}`
  );
  const [customerEmail, setCustomerEmail] = useState(customer.email);
  const [phone, setPhone] = useState('+880 1711 000000');
  const [addressLine1, setAddressLine1] = useState(
    'House 14, Road 7, Dhanmondi R/A'
  );
  const [city, setCity] = useState(
    currentRegion.currency_code === 'BDT' ? 'Dhaka' : 'London'
  );
  const [postalCode, setPostalCode] = useState(
    currentRegion.currency_code === 'BDT' ? '1205' : 'SW1A 1AA'
  );

  const [paymentMethod, setPaymentMethod] = useState<
    'cod' | 'card_stripe' | 'bkash_nagad' | 'bank_transfer'
  >(
    currentRegion.cod_supported && cart.has_physical_items
      ? 'cod'
      : 'card_stripe'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<AtelierOrder | null>(
    null
  );

  const hasPhysical = cart.has_physical_items;
  const hasDigital = cart.has_digital_items;
  const isDigitalOnly = hasDigital && !hasPhysical;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        customerName,
        customerEmail,
        paymentMethod,
        shippingAddress: hasPhysical
          ? {
              first_name: customerName.split(' ')[0],
              last_name: customerName.split(' ')[1] || '',
              address_1: addressLine1,
              city,
              postal_code: postalCode,
              country_code: currentRegion.countries[0],
              phone,
            }
          : undefined,
        measurements: customer.measurements,
      });

      setCompletedOrder(order);
      onOrderCompleted?.(order);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
            <span>Order Reference: #{completedOrder.order_number}</span>
            <span aria-hidden="true">·</span>
            <span>{new Date(completedOrder.created_at).toLocaleDateString()}</span>
          </div>

          <h1 className="text-2xl font-serif font-medium text-zinc-950 mb-2">
            {completedOrder.has_physical_items && completedOrder.has_digital_items
              ? 'Sartorial Order & Pattern License Confirmed'
              : completedOrder.has_digital_items
              ? 'Digital Pattern License Ready for S3 Download'
              : 'Atelier Garment Commission Confirmed'}
          </h1>

          <p className="text-xs text-zinc-600 leading-relaxed mb-6">
            A confirmation receipt and authentication tokens have been issued to{' '}
            <strong className="text-zinc-900">{completedOrder.customer_email}</strong>.
          </p>

          {/* If contains digital patterns: instant signed S3 download callout */}
          {completedOrder.has_digital_items && (
            <div className="mb-6 p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 mb-1">
                <Download className="w-4 h-4 text-emerald-800" />
                <span>Instant S3 Digital Access Active</span>
              </div>
              <p className="text-xs text-emerald-800 mb-3">
                Your XS–5XL graded patterns with A0 copy-shop, A4 home-print, and projector layers are authorized.
              </p>
              <Link
                href="/account/downloads"
                className="inline-flex items-center gap-1.5 py-2 px-4 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-medium rounded-md shadow-xs transition-colors"
              >
                <span>Access Download Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* If contains physical atelier garments: lifecycle tracker notice */}
          {completedOrder.has_physical_items && (
            <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200/80 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-950 mb-1">
                <Scissors className="w-4 h-4 text-amber-900" />
                <span>Dhaka Atelier Production Initiated</span>
              </div>
              <p className="text-xs text-amber-900 mb-3">
                Our master cutter in Dhaka is auditing your anatomical measurements. You can monitor every step of the 7-stage tailoring lifecycle in real-time.
              </p>
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-1.5 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md shadow-xs transition-colors"
              >
                <span>Track Atelier Progress</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Order Summary breakdown */}
          <div className="border-t border-zinc-100 pt-5">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">
              Purchased Items
            </h4>
            <div className="space-y-3 mb-4">
              {completedOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs text-zinc-700">
                  <div>
                    <span className="font-medium text-zinc-900">{it.product_title}</span>
                    <span className="text-[11px] text-zinc-500 block">
                      {it.product_type === 'digital_pattern'
                        ? 'Digital Pattern Suite (5 S3 Downloads Allowed)'
                        : `Atelier Made-to-Order (${it.selected_textile || 'Heritage Textile'})`}
                    </span>
                  </div>
                  <span className="tabular-nums font-mono text-zinc-900">
                    {formatPrice(it.total_price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-100 flex justify-between text-sm font-semibold text-zinc-950">
              <span>Total Paid</span>
              <span className="tabular-nums font-mono">
                {formatPrice(completedOrder.total)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href="/"
              className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE CHECKOUT FORM
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {onCancel && (
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer identification */}
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-4">
              <ShieldCheck className="w-4 h-4 text-zinc-700" />
              <span>1. Customer & Account Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
                />
                <span className="text-[10px] text-zinc-400 mt-0.5 block">
                  Signed download tokens will be licensed to this email.
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Shipping (SKIPPED if Digital-only purchase!) */}
          {hasPhysical ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900">
                  <Truck className="w-4 h-4 text-zinc-700" />
                  <span>2. Atelier Garment Shipping Destination</span>
                </div>
                <span className="text-[11px] text-amber-900 font-medium">
                  Dhaka Atelier Dispatch
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-600 mb-1">City / Region</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/70 rounded-md text-[11px] text-zinc-600">
                  Standard Atelier Express: Packaged in breathable organic cotton garment bags with cedarwood repellent.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
              <Download className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-emerald-950">
                  Physical Shipping Skipped (Digital-Only Order)
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  No unnecessary physical shipping details requested. Your pattern licenses are delivered instantly via our authenticated S3 vault.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method Selection */}
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-4">
              <CreditCard className="w-4 h-4 text-zinc-700" />
              <span>3. Payment Configuration</span>
            </div>

            <div className="space-y-2.5">
              {/* Cash on Delivery (only eligible for physical orders in Bangladesh) */}
              {currentRegion.cod_supported && hasPhysical && (
                <label
                  className={`p-3.5 border rounded-lg flex items-start justify-between cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-zinc-900 bg-zinc-50/80 shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-amber-800" />
                        <span>Cash on Delivery (Domestic Bangladesh)</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Pay upon receiving and inspecting your hand-tailored atelier garment in Dhaka or nationwide courier.
                      </div>
                    </div>
                  </div>
                </label>
              )}

              {/* Card / Stripe */}
              <label
                className={`p-3.5 border rounded-lg flex items-start justify-between cursor-pointer transition-all ${
                  paymentMethod === 'card_stripe'
                    ? 'border-zinc-900 bg-zinc-50/80 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card_stripe'}
                    onChange={() => setPaymentMethod('card_stripe')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-zinc-700" />
                      <span>Credit / Debit Card (Stripe Gateway)</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Visa, Mastercard, American Express via encrypted 256-bit SSL.
                    </div>
                  </div>
                </div>
              </label>

              {/* bKash / Nagad (Bangladesh domestic online payment) */}
              {currentRegion.currency_code === 'BDT' && (
                <label
                  className={`p-3.5 border rounded-lg flex items-start justify-between cursor-pointer transition-all ${
                    paymentMethod === 'bkash_nagad'
                      ? 'border-zinc-900 bg-zinc-50/80 shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bkash_nagad'}
                      onChange={() => setPaymentMethod('bkash_nagad')}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-pink-700" />
                        <span>bKash / Nagad Direct Mobile Gateway</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Instant merchant payment confirmation for domestic Bangladesh sewists and clients.
                      </div>
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-md shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Authorizing with Medusa...'
                : `Complete Order (${formatPrice(cart.total)})`}
            </span>
          </button>
        </form>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 pb-3 border-b border-zinc-100 mb-3">
              Order Breakdown
            </h3>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <div>
                    <div className="font-medium text-zinc-900">{item.product_title}</div>
                    <div className="text-[11px] text-zinc-500">
                      {item.product_type === 'digital_pattern'
                        ? 'Digital Graded PDF (A0/A4/Projector)'
                        : `Bespoke Atelier (${item.selected_textile || 'Heritage Weave'})`}
                    </div>
                    {item.is_b2b_discounted && (
                      <div className="text-[10px] text-emerald-700">
                        {item.discount_label}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {item.is_b2b_discounted && (
                      <div className="text-[10px] text-zinc-400 line-through font-mono">
                        {formatPrice(item.original_unit_price * item.quantity)}
                      </div>
                    )}
                    <span className="tabular-nums font-mono text-zinc-900 font-semibold">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-zinc-100 text-xs">
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
                <span>Total Due</span>
                <span className="tabular-nums font-mono">{formatPrice(cart.total)}</span>
              </div>
            </div>
          </div>

          {/* Region policy card */}
          <div className="p-4 bg-zinc-50 border border-zinc-200/70 rounded-lg text-[11px] text-zinc-600 space-y-1.5">
            <div className="font-semibold text-zinc-900">
              Commerce Region: {currentRegion.name}
            </div>
            <div>
              Currency: <strong>{currentRegion.currency_code}</strong> · Taxes and domestic rules applied authoritatively via Medusa engine.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
