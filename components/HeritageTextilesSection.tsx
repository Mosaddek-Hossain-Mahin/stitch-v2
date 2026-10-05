'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GarmentTextile } from '@/lib/medusa/types';
import { Scissors, Sparkles, MapPin, Clock, Award } from 'lucide-react';

interface HeritageTextilesSectionProps {
  onSelectTextileFilter?: (textile: GarmentTextile) => void;
}

const TEXTILE_STORIES: {
  name: GarmentTextile;
  title: string;
  tagline: string;
  origin: string;
  history: string;
  technique: string;
  image: string;
}[] = [
  {
    name: 'Jamdani',
    title: 'Dhakai Jamdani: Woven Poetry on Pit Looms',
    tagline: 'UNESCO Intangible Cultural Heritage of Humanity',
    origin: 'Demra & Rupganj, Shitalakshya River Basin, Dhaka',
    history:
      'Celebrated for over eight centuries, Jamdani is a discontinuous supplementary weft technique where master weavers memorize complex mathematical symmetries. Motifs like Tercha (diagonal florals) and Panna Hajar (thousand emeralds) are woven entirely by hand without mechanical jacquards.',
    technique: 'Fine unbleached cotton base with fine gold & silver zari thread shuttled via seasoned horn needles.',
    image: '/images/jamdani.jpg',
  },
  {
    name: 'Dhaka Muslin',
    title: 'Historic Dhaka Muslin: The Glass Cloth of the Mughals',
    tagline: 'Gossamer Heritage Revived from Historic Phuti Karpas Cotton',
    origin: 'Meghna & Brahmaputra River Confluence, Bangladesh',
    history:
      'Legendary gossamer fabric so fine that an entire 10-meter saree could pass through a signet ring. Lost for nearly two centuries following colonial de-industrialization, our atelier partners with research agronomists and generational female spinners who spin 300+ count threads at dawn when river humidity is peak.',
    technique: 'Single-ply micro-spun organic cotton with weightless hand feel and ethereal drape.',
    image: '/images/hero.jpg',
  },
  {
    name: 'Mirpur Katan',
    title: 'Mirpur Katan: Heavy Royal Silk Brocade',
    tagline: 'Lustrous Mulberry Silk from the Historic Dhaka Weavers Enclave',
    origin: 'Mirpur Artisanal Weavers Colony, Dhaka',
    history:
      'Mirpur’s katan tradition was established by generational silk weavers who brought ancestral brocade methods to the capital. Characterized by tightly twisted pure silk warp yarns and dense metallic wefts, producing a garment with magnificent sculptural drape.',
    technique: 'Canvassed pure silk brocade resistant to creasing with rich tactile luster.',
    image: '/images/katan.jpg',
  },
  {
    name: 'Rajshahi wild Endi silk',
    title: 'Rajshahi Wild Endi: Non-Violent Peace Silk',
    tagline: 'Thermal-Adapting Wild Silk from the Northern Sericulture Groves',
    origin: 'Rajshahi Sericulture Basin, Northern Bangladesh',
    history:
      'Endi (or Eri) silk is harvested naturally only after the silkworm has hatched and flown away, making it an ethical non-violent textile. The irregular, slubbed fiber has a unique thermal temperament: it acts as a cozy insulator in cool air while breathing like fine linen under warm sun.',
    technique: 'Hand-reeled raw wild silk yarn dyed with natural plant barks and washed in river mineral water.',
    image: '/images/hero.jpg',
  },
];

export function HeritageTextilesSection({ onSelectTextileFilter }: HeritageTextilesSectionProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = TEXTILE_STORIES[selectedIdx];

  return (
    <section id="textiles" className="py-20 bg-[#FDFBF7] border-y border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Indigenous Material Integrity</span>
          </div>
          <h2 className="text-3xl font-serif font-normal text-zinc-950 tracking-tight">
            The Living Bangladeshi Textiles of Our Dhaka Atelier
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
            Our atelier does not treat textiles as generic inventory options. Every garment is commission-cut from historic hand-loomed fibers with documented generational provenance.
          </p>
        </div>

        {/* Textile Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-zinc-200">
          {TEXTILE_STORIES.map((textile, idx) => (
            <button
              key={textile.name}
              onClick={() => setSelectedIdx(idx)}
              className={`px-4 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              {textile.name}
            </button>
          ))}
        </div>

        {/* Spotlight Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-xs">
          {/* Image Left (5 cols) */}
          <div className="lg:col-span-5 relative aspect-4/3 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200/80">
            <Image
              src={active.image}
              alt={active.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-sm text-[11px] font-semibold text-zinc-900 border border-zinc-200 shadow-xs">
              {active.name}
            </div>
          </div>

          {/* Text Right (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{active.tagline}</span>
              </div>
              <h3 className="text-2xl font-serif font-medium text-zinc-950">
                {active.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-zinc-700" />
              <span>{active.origin}</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {active.history}
            </p>

            <div className="p-3.5 bg-zinc-50 rounded-md border border-zinc-200/80 text-xs text-zinc-700 space-y-1">
              <strong className="text-zinc-900">Weave Mechanics:</strong> {active.technique}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onSelectTextileFilter?.(active.name);
                  const el = document.getElementById('garments');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>View Made-to-Order {active.name} Garments</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
