'use client';

import React from 'react';
import {
  AtelierOrder,
  AtelierProductionStage,
} from '@/lib/medusa/types';
import { useMedusa } from '@/lib/medusa/context';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Scissors,
  Layers,
  ShieldCheck,
  Truck,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';

interface AtelierTrackerProps {
  order: AtelierOrder;
}

const STAGES: {
  id: AtelierProductionStage;
  label: string;
  description: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'measurements_review',
    label: '1. Measurements Audit',
    description: 'Master patternmaker calculates individual garment ease from submitted measurements.',
    location: 'Dhaka Studio, Bangladesh',
    icon: Scissors,
  },
  {
    id: 'textile_preparation',
    label: '2. Textile Selection & Prep',
    description: 'Authentic handwoven textile (Jamdani / Muslin / Katan / Endi) inspected and pre-shrunk in mineral water.',
    location: 'Demra & Mirpur Weavers Enclave',
    icon: Layers,
  },
  {
    id: 'cutting',
    label: '3. Master Cutting',
    description: 'Precision panel cutting aligning weft motifs and structural grain lines.',
    location: 'Main Cutting Table, Dhaka',
    icon: Scissors,
  },
  {
    id: 'stitching',
    label: '4. Artisanal Stitching',
    description: 'Single-needle construction with reinforced French seams and silk thread edge finish.',
    location: 'Tailoring Atelier, Dhaka',
    icon: Sparkles,
  },
  {
    id: 'qc',
    label: '5. Quality Control (QC)',
    description: 'Ten-point inspection: dimension tolerances (±2mm), seam stability, and hand-pressed steaming.',
    location: 'Atelier Inspection Desk',
    icon: ShieldCheck,
  },
  {
    id: 'shipping',
    label: '6. Dispatch & Courier',
    description: 'Carefully wrapped in unbleached mulberry paper and dispatched with tracked courier.',
    location: 'Dhaka Logistics Hub',
    icon: Truck,
  },
  {
    id: 'delivered',
    label: '7. Handcrafted Delivery',
    description: 'Garment safely received by client.',
    location: 'Destination',
    icon: PackageCheck,
  },
];

export function AtelierTracker({ order }: AtelierTrackerProps) {
  const { advanceOrderStage } = useMedusa();

  const currentStageIndex = STAGES.findIndex(
    (s) => s.id === (order.production_stage || 'measurements_review')
  );

  const handleAdvanceSimulation = () => {
    if (currentStageIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentStageIndex + 1].id;
      advanceOrderStage(order.id, nextStage);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-zinc-100 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dhaka Atelier Production Lifecycle</span>
          </div>
          <h3 className="text-base font-serif font-medium text-zinc-950 mt-0.5">
            Order #{order.order_number} · Made-to-Order Tracking
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Every physical garment is meticulously hand-tailored in Dhaka from heritage Bangladeshi textiles.
          </p>
        </div>

        {/* Demo Advance Button for testing */}
        <div className="flex items-center gap-2">
          {currentStageIndex < STAGES.length - 1 ? (
            <button
              onClick={handleAdvanceSimulation}
              className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Simulate Next Atelier Stage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Production Complete & Delivered</span>
            </span>
          )}
        </div>
      </div>

      {/* 7-Stage Horizontal / Vertical Stepper */}
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;

            return (
              <div
                key={stage.id}
                className={`relative flex md:flex-col items-start gap-3 p-3 rounded-md transition-all ${
                  isCurrent
                    ? 'bg-amber-50/70 border border-amber-200/80 shadow-xs'
                    : isCompleted
                    ? 'bg-zinc-50/80 border border-zinc-200/50'
                    : 'opacity-50 border border-dashed border-zinc-200'
                }`}
              >
                {/* Stage marker */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-800 text-white ring-4 ring-amber-100'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-zinc-900 leading-tight">
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 leading-normal line-clamp-2">
                    {stage.description}
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-1 font-mono">
                    {stage.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Log History */}
      {order.production_notes && order.production_notes.length > 0 && (
        <div className="pt-4 border-t border-zinc-100">
          <div className="text-xs font-semibold text-zinc-900 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Atelier Production Log (Dhaka Workshop)</span>
          </div>
          <div className="space-y-1.5">
            {order.production_notes.map((note, nIdx) => (
              <div
                key={nIdx}
                className="text-xs text-zinc-600 flex items-start gap-2 bg-zinc-50 px-3 py-2 rounded-md border border-zinc-200/40"
              >
                <span className="text-amber-800 shrink-0 font-mono text-[10px] mt-0.5">
                  #{nIdx + 1}
                </span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
