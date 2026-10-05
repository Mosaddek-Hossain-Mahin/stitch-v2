export type ProductType = 'digital_pattern' | 'physical_garment';

export type GarmentTextile =
  | 'Jamdani'
  | 'Dhaka Muslin'
  | 'Mirpur Katan'
  | 'Rajshahi wild Endi silk';

export type AtelierProductionStage =
  | 'measurements_review'
  | 'textile_preparation'
  | 'cutting'
  | 'stitching'
  | 'qc'
  | 'shipping'
  | 'delivered';

export interface CustomerMeasurements {
  bust: number; // inches
  waist: number;
  hips: number;
  height: number;
  shoulderWidth?: number;
  armLength?: number;
  customNotes?: string;
}

export type CustomerGroupType = 'Standard' | 'Boutique' | 'Educator';

export interface StoreRegion {
  id: string;
  name: string;
  currency_code: string;
  currency_symbol: string;
  tax_rate: number; // e.g. 0.05 for 5% VAT in Bangladesh
  tax_label: string;
  countries: string[];
  cod_supported: boolean;
  default_shipping_cost: number;
}

export interface DigitalPatternDetails {
  grading_range: 'XS–5XL';
  available_sizes: string[];
  formats: {
    a0_copyshop: boolean;
    a4_home: boolean;
    us_letter: boolean;
    projector_file: boolean;
    layered_pdf: boolean;
  };
  total_pages: number;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  seam_allowance_included: boolean;
  max_downloads_per_license: number;
}

export interface GarmentDetails {
  textile: GarmentTextile;
  origin: string; // e.g. "Demra, Dhaka" or "Mirpur, Dhaka"
  weave_time_days: number;
  lining_fabric: string;
  production_lead_time_weeks: number;
  sizing_type: 'Made-to-Order Bespoke' | 'Standard Sized Atelier';
}

export interface StoreVariant {
  id: string;
  title: string;
  sku: string;
  prices: Record<string, number>; // currency_code -> amount in minor units or regular units
  wholesale_prices?: Record<string, number>; // B2B Boutique / Educator 40% wholesale pricing
  options: {
    name: string;
    value: string;
  }[];
  inventory_quantity: number;
}

export interface StoreProduct {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  product_type: ProductType;
  category: 'patterns' | 'garments' | 'textiles';
  collection?: string;
  thumbnail: string;
  images: string[];
  variants: StoreVariant[];
  base_prices: Record<string, number>; // currency_code -> amount (regular unit e.g. BDT 4500, USD 45)
  wholesale_prices?: Record<string, number>; // 40% wholesale for Boutique/Educator
  digital_details?: DigitalPatternDetails;
  garment_details?: GarmentDetails;
  tags: string[];
  is_featured?: boolean;
}

export interface StoreCartItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  product_title: string;
  thumbnail: string;
  product_type: ProductType;
  quantity: number;
  unit_price: number; // in current currency
  original_unit_price: number;
  is_b2b_discounted: boolean;
  discount_label?: string;
  total_price: number;
  measurements?: CustomerMeasurements;
  selected_textile?: GarmentTextile;
  pattern_format_selection?: string[];
}

export interface StoreCart {
  id: string;
  items: StoreCartItem[];
  region: StoreRegion;
  shipping_address?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    postal_code: string;
    country_code: string;
    phone: string;
  };
  shipping_option?: {
    id: string;
    name: string;
    amount: number;
  };
  payment_method?: 'cod' | 'card_stripe' | 'bkash_nagad' | 'bank_transfer';
  has_physical_items: boolean;
  has_digital_items: boolean;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  total: number;
}

export interface SecureDigitalDownload {
  id: string;
  order_id: string;
  order_number: string;
  product_id: string;
  product_title: string;
  file_name: string;
  file_size_mb: number;
  format_type: 'A0 Copy-Shop' | 'A4 Print-at-Home' | 'US Letter' | 'Projector (Layers)' | 'Complete Pattern Suite (ZIP)';
  downloads_used: number;
  max_downloads: number;
  signed_s3_url: string;
  expires_at: string;
  licensed_to: string;
}

export interface AtelierOrder {
  id: string;
  order_number: string;
  created_at: string;
  status: 'pending' | 'in_production' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'awaiting_payment' | 'cod_pending';
  total: number;
  currency_code: string;
  customer_name: string;
  customer_email: string;
  has_physical_items: boolean;
  has_digital_items: boolean;
  items: StoreCartItem[];
  production_stage?: AtelierProductionStage;
  stage_updated_at?: string;
  production_notes?: string[];
  tracking_number?: string;
  downloads?: SecureDigitalDownload[];
}

export interface StoreCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  customer_group: CustomerGroupType;
  b2b_organization?: string;
  b2b_verified: boolean;
  measurements?: CustomerMeasurements;
  orders: AtelierOrder[];
  downloads: SecureDigitalDownload[];
}
