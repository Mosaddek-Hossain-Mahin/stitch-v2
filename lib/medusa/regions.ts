import { StoreRegion } from './types';

export const STORE_REGIONS: StoreRegion[] = [
  {
    id: 'reg_bd_01',
    name: 'Bangladesh (Domestic Atelier)',
    currency_code: 'BDT',
    currency_symbol: '৳',
    tax_rate: 0.05, // 5% Domestic VAT
    tax_label: 'Bangladesh VAT (5%)',
    countries: ['BD'],
    cod_supported: true,
    default_shipping_cost: 150, // BDT 150 for Dhaka / nationwide courier
  },
  {
    id: 'reg_us_02',
    name: 'North America (USD)',
    currency_code: 'USD',
    currency_symbol: '$',
    tax_rate: 0.0, // Calculated at checkout per state / customs
    tax_label: 'Estimated Sales Tax',
    countries: ['US', 'CA'],
    cod_supported: false,
    default_shipping_cost: 28, // USD 28 DHL Express
  },
  {
    id: 'reg_uk_03',
    name: 'United Kingdom (GBP)',
    currency_code: 'GBP',
    currency_symbol: '£',
    tax_rate: 0.2, // 20% Standard UK VAT
    tax_label: 'UK VAT (20%)',
    countries: ['GB'],
    cod_supported: false,
    default_shipping_cost: 22, // GBP 22 Express
  },
  {
    id: 'reg_eu_04',
    name: 'Europe (EUR)',
    currency_code: 'EUR',
    currency_symbol: '€',
    tax_rate: 0.21, // 21% Standard EU VAT
    tax_label: 'EU VAT (21%)',
    countries: ['DE', 'FR', 'NL', 'IT', 'ES', 'SE'],
    cod_supported: false,
    default_shipping_cost: 25, // EUR 25 Express
  },
  {
    id: 'reg_apac_05',
    name: 'Asia-Pacific (SGD)',
    currency_code: 'SGD',
    currency_symbol: 'S$',
    tax_rate: 0.09, // 9% GST
    tax_label: 'APAC GST (9%)',
    countries: ['SG', 'MY', 'JP', 'AU'],
    cod_supported: false,
    default_shipping_cost: 32, // SGD 32 Express
  },
];

/**
 * Format price as single authoritative presentation layer
 */
export function formatPrice(
  amount: number,
  currencyCode: string = 'BDT'
): string {
  const normalizedCode = currencyCode.toUpperCase();

  switch (normalizedCode) {
    case 'BDT':
      // Bangladeshi Taka standard format e.g. ৳ 4,500
      return `৳ ${Math.round(amount).toLocaleString('en-IN')}`;
    case 'USD':
      return `$${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    case 'GBP':
      return `£${amount.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    case 'EUR':
      return `€${amount.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    case 'SGD':
      return `S$${amount.toLocaleString('en-SG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    default:
      return `${normalizedCode} ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
  }
}
