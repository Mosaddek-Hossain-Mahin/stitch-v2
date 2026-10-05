'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SecureDigitalDownload } from '@/lib/medusa/types';
import { useMedusa } from '@/lib/medusa/context';
import {
  Download,
  FileText,
  Lock,
  CheckCircle,
  AlertCircle,
  Layers,
  Printer,
  Projector,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface DigitalDownloadCenterProps {
  downloads?: SecureDigitalDownload[];
}

function generateSpecificationBlob(item: SecureDigitalDownload, formatLabel: string): Blob {
  const fileContent =
    `STITCH BD — GRADED SEWING PATTERN BLUEPRINT\n` +
    `============================================\n` +
    `Product: ${item.product_title}\n` +
    `Format: ${formatLabel}\n` +
    `Grading: XS – 5XL (Layered PDF with 1.5cm seam allowances)\n` +
    `Licensed To: ${item.licensed_to}\n` +
    `Order ID: ${item.order_number}\n` +
    `S3 Signature ID: ${item.id}\n` +
    `License Expires: ${item.expires_at}\n\n` +
    `INCLUDED FILES IN SPECIFICATION:\n` +
    `- ${item.product_title} - A0 CopyShop Full Architecture.pdf\n` +
    `- ${item.product_title} - A4 Print At Home (Border calibrated).pdf\n` +
    `- ${item.product_title} - US Letter Graded Layers.pdf\n` +
    `- ${item.product_title} - Projector Layer Calibration (Dark/Light mode).pdf\n` +
    `- Sewing Instruction Booklet & Yardage Matrix.pdf\n\n` +
    `Thank you for supporting Dhaka heritage textiles and independent graded patternmaking.`;

  return new Blob([fileContent], { type: 'application/pdf' });
}

export function DigitalDownloadCenter({ downloads: propDownloads }: DigitalDownloadCenterProps) {
  const { downloads: contextDownloads, decrementDownloadCount } = useMedusa();
  const downloads = propDownloads || contextDownloads;

  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<{
    id: string;
    text: string;
    isError?: boolean;
  } | null>(null);

  const handleDownload = async (item: SecureDigitalDownload, formatLabel: string) => {
    setActiveDownloadId(item.id);
    setDownloadMessage(null);

    const result = await decrementDownloadCount(item.id);

    if (result.success) {
      setDownloadMessage({
        id: item.id,
        text: `Secure S3 download initiated for ${formatLabel}. ${result.remaining} of ${item.max_downloads} downloads remaining.`,
      });

      // Trigger client file save simulation
      try {
        const dummyBlob = generateSpecificationBlob(item, formatLabel);
        const url = URL.createObjectURL(dummyBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.product_title.replace(/\s+/g, '_')}_${formatLabel.replace(
          /\s+/g,
          '_'
        )}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        // browser fallback
      }
    } else {
      setDownloadMessage({
        id: item.id,
        text: result.message,
        isError: true,
      });
    }

    setActiveDownloadId(null);
  };

  if (downloads.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center max-w-lg mx-auto">
        <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
        <h3 className="text-base font-serif font-medium text-zinc-900 mb-1">
          No Digital Patterns in License Vault
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          When you purchase graded sewing patterns, your encrypted S3 signed links will appear here immediately with 5 lifetime downloads per license.
        </p>
        <Link
          href="/#patterns"
          className="inline-flex items-center gap-1.5 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Browse Graded Patterns (XS–5XL)</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-3">
        <div>
          <h2 className="text-lg font-serif font-medium text-zinc-950">
            Secure S3 Digital Pattern Access
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Signed high-speed S3 delivery with multi-format architecture (A0, A4, US Letter & Projector). Maximum 5 downloads enforced per license.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Authenticated Customer Vault</span>
        </div>
      </div>

      <div className="space-y-4">
        {downloads.map((item) => {
          const remaining = Math.max(0, item.max_downloads - item.downloads_used);
          const isExhausted = remaining <= 0;

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-lg p-5 transition-all ${
                isExhausted
                  ? 'border-zinc-200 opacity-75'
                  : 'border-zinc-200/90 hover:border-zinc-400 shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                    <span>Order #{item.order_number}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-zinc-700">XS–5XL Full Grade</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.file_size_mb} MB</span>
                  </div>

                  <h3 className="text-base font-serif font-medium text-zinc-950">
                    {item.product_title}
                  </h3>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Licensed to: <span className="font-mono text-zinc-700">{item.licensed_to}</span>
                  </div>
                </div>

                {/* Download counter badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-md text-xs font-mono tabular-nums flex items-center gap-2 border ${
                      isExhausted
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : remaining <= 2
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {remaining} of {item.max_downloads} downloads remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Format Download Buttons */}
              <div className="pt-4">
                <div className="text-xs font-semibold text-zinc-700 mb-2">
                  Select Format to Download:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {/* Option 1: Complete Bundle */}
                  <button
                    disabled={isExhausted || activeDownloadId === item.id}
                    onClick={() => handleDownload(item, 'Complete Pattern Suite (ZIP)')}
                    className="p-3 border border-zinc-200 rounded-md text-left hover:border-zinc-900 hover:bg-zinc-50 transition-all flex flex-col justify-between group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 mb-1">
                        <span>Full ZIP Bundle</span>
                        <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900" />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Contains all PDF formats, instruction booklet & calibration layers.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: A0 Copy Shop */}
                  <button
                    disabled={isExhausted || activeDownloadId === item.id}
                    onClick={() => handleDownload(item, 'A0 Copy-Shop PDF')}
                    className="p-3 border border-zinc-200 rounded-md text-left hover:border-zinc-900 hover:bg-zinc-50 transition-all flex flex-col justify-between group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 mb-1">
                        <span>A0 Copy-Shop</span>
                        <Printer className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900" />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Wide-format architectural printing. No home tiling needed.
                      </p>
                    </div>
                  </button>

                  {/* Option 3: A4 & US Letter */}
                  <button
                    disabled={isExhausted || activeDownloadId === item.id}
                    onClick={() => handleDownload(item, 'A4 & US Letter Home Print')}
                    className="p-3 border border-zinc-200 rounded-md text-left hover:border-zinc-900 hover:bg-zinc-50 transition-all flex flex-col justify-between group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 mb-1">
                        <span>A4 / US Letter</span>
                        <Layers className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900" />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Print-at-home tiled pages with 100% test square box.
                      </p>
                    </div>
                  </button>

                  {/* Option 4: Projector Files */}
                  <button
                    disabled={isExhausted || activeDownloadId === item.id}
                    onClick={() => handleDownload(item, 'Layered Projector PDF')}
                    className="p-3 border border-zinc-200 rounded-md text-left hover:border-zinc-900 hover:bg-zinc-50 transition-all flex flex-col justify-between group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 mb-1">
                        <span>Projector File</span>
                        <Projector className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900" />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Calibrated grid layers, thick lines, inverted dark-mode layer.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Feedback messages */}
              {downloadMessage && downloadMessage.id === item.id && (
                <div
                  className={`mt-3 p-2.5 rounded-md text-xs flex items-center gap-2 ${
                    downloadMessage.isError
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {downloadMessage.isError ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{downloadMessage.text}</span>
                </div>
              )}

              {isExhausted && (
                <div className="mt-3 p-3 bg-zinc-100 rounded-md text-xs text-zinc-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-zinc-500" />
                    <span>Download threshold reached (5 of 5). File signature locked.</span>
                  </span>
                  <a
                    href="mailto:support@stitchbd.com"
                    className="text-xs font-medium text-zinc-900 underline hover:text-zinc-700"
                  >
                    Request License Extension
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
