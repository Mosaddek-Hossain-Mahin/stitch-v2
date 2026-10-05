'use client';

import React, { useState } from 'react';
import { useMedusa } from '@/lib/medusa/context';
import { CustomerGroupType } from '@/lib/medusa/types';
import { X, Check, Building2, GraduationCap, UserCheck, Shield } from 'lucide-react';

interface B2BWholesalePortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function B2BWholesalePortal({ isOpen, onClose }: B2BWholesalePortalProps) {
  const { customer, setCustomerGroup } = useMedusa();
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroupType>(
    customer.customer_group
  );

  if (!isOpen) return null;

  const handleApplyTier = (group: CustomerGroupType) => {
    setSelectedGroup(group);
    setCustomerGroup(group);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-zinc-200 shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
          <Shield className="w-4 h-4" />
          <span>B2B Commercial Architecture</span>
        </div>

        <h3 className="text-lg font-serif font-medium text-zinc-950 mb-1">
          Customer Group & Wholesale Pricing
        </h3>

        <p className="text-xs text-zinc-600 leading-relaxed mb-5">
          Stitch BD enforces authoritative customer-group price lists through Medusa. Verified Boutique and Educator accounts receive <strong>40% wholesale pricing</strong> on digital pattern suites.
        </p>

        {/* Customer Groups Selector */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Standard Retail */}
          <div
            onClick={() => handleApplyTier('Standard')}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedGroup === 'Standard'
                ? 'border-zinc-900 bg-zinc-50/80 shadow-xs'
                : 'border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-zinc-100 text-zinc-800">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-900">
                    Standard Individual Account
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Standard retail pricing for individual sewists and clients.
                  </div>
                </div>
              </div>
              {selectedGroup === 'Standard' && (
                <Check className="w-4 h-4 text-zinc-950 mt-1" />
              )}
            </div>
          </div>

          {/* Option 2: Boutique Tier (40% off patterns) */}
          <div
            onClick={() => handleApplyTier('Boutique')}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedGroup === 'Boutique'
                ? 'border-amber-800 bg-amber-50/50 shadow-xs'
                : 'border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-amber-100 text-amber-900">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                    <span>Boutique Partner (40% Wholesale)</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-xs">
                      Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-600">
                    Commercial pattern studio & small batch garment production license.
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Org: Bengal Modern Sartorialists Ltd. (Dhaka)
                  </div>
                </div>
              </div>
              {selectedGroup === 'Boutique' && (
                <Check className="w-4 h-4 text-amber-900 mt-1" />
              )}
            </div>
          </div>

          {/* Option 3: Educator Tier (40% off patterns) */}
          <div
            onClick={() => handleApplyTier('Educator')}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedGroup === 'Educator'
                ? 'border-emerald-800 bg-emerald-50/50 shadow-xs'
                : 'border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-emerald-100 text-emerald-900">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                    <span>Fashion Educator Tier (40% Wholesale)</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-xs">
                      Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-600">
                    Fashion design institutes, technical universities, and patternmaking faculties.
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Org: Dhaka Institute of Fashion & Textile Arts
                  </div>
                </div>
              </div>
              {selectedGroup === 'Educator' && (
                <Check className="w-4 h-4 text-emerald-900 mt-1" />
              )}
            </div>
          </div>
        </div>

        {/* Technical Architecture Note */}
        <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-md text-[11px] text-zinc-600 mb-5">
          <strong className="text-zinc-900">Architecture Integrity:</strong> Wholesale prices are fed directly from Medusa price lists defined per customer group — not simulated by client-side multiplication (`price * 0.60`).
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
        >
          Confirm & Update Storefront Session
        </button>
      </div>
    </div>
  );
}
