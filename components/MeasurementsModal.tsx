'use client';

import React, { useState } from 'react';
import { CustomerMeasurements, StoreProduct } from '@/lib/medusa/types';
import { useMedusa } from '@/lib/medusa/context';
import { X, Ruler, Scissors, Check } from 'lucide-react';

interface MeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: StoreProduct | null;
  onConfirmAndAddToCart?: (measurements: CustomerMeasurements) => void;
}

export function MeasurementsModal({
  isOpen,
  onClose,
  product,
  onConfirmAndAddToCart,
}: MeasurementsModalProps) {
  const { customer, updateCustomerMeasurements, addItemToCart } = useMedusa();

  const [measurements, setMeasurements] = useState<CustomerMeasurements>(
    customer.measurements || {
      bust: 36,
      waist: 28,
      hips: 39,
      height: 165,
      shoulderWidth: 15,
      armLength: 22,
      customNotes: '',
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerMeasurements(measurements);

    if (onConfirmAndAddToCart) {
      onConfirmAndAddToCart(measurements);
    } else if (product) {
      addItemToCart(product, 1, measurements);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-zinc-200 shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
          <Scissors className="w-4 h-4" />
          <span>Dhaka Atelier · Bespoke Made-to-Order</span>
        </div>

        <h3 className="text-lg font-serif font-medium text-zinc-950 mb-1">
          {product ? `Tailor ${product.title}` : 'Bespoke Measurements Profile'}
        </h3>

        <p className="text-xs text-zinc-600 leading-relaxed mb-5">
          Because each garment is handcrafted specifically for you in Dhaka from heritage Bangladeshi textiles, our master tailor cuts directly according to your anatomical measurements.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Bust / Chest (inches)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={measurements.bust}
                onChange={(e) =>
                  setMeasurements({ ...measurements, bust: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs font-mono px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Waist (inches)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={measurements.waist}
                onChange={(e) =>
                  setMeasurements({ ...measurements, waist: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs font-mono px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Hips (inches)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={measurements.hips}
                onChange={(e) =>
                  setMeasurements({ ...measurements, hips: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs font-mono px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                required
                value={measurements.height}
                onChange={(e) =>
                  setMeasurements({ ...measurements, height: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs font-mono px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Shoulder Width (inches)
              </label>
              <input
                type="number"
                step="0.5"
                value={measurements.shoulderWidth || 15}
                onChange={(e) =>
                  setMeasurements({
                    ...measurements,
                    shoulderWidth: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full text-xs font-mono px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Arm / Sleeve Length (inches)
              </label>
              <input
                type="number"
                step="0.5"
                value={measurements.armLength || 22}
                onChange={(e) =>
                  setMeasurements({
                    ...measurements,
                    armLength: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full text-xs font-mono px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Custom Ease or Fit Preference (Optional)
            </label>
            <textarea
              rows={2}
              value={measurements.customNotes || ''}
              onChange={(e) =>
                setMeasurements({ ...measurements, customNotes: e.target.value })
              }
              placeholder="e.g., Prefer a relaxed drape around the chest placket, extra 1 inch sleeve length..."
              className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-md focus:outline-hidden focus:border-zinc-900"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-md text-[11px] text-amber-950 flex items-start gap-2">
            <Ruler className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong>Atelier Guarantee:</strong> If our master tailor notes any disproportionate ease values, we will reach out prior to the cutting phase to confirm.
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-zinc-300 text-zinc-700 text-xs font-medium rounded-md hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{product ? 'Confirm & Add to Bag' : 'Save Measurements'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
