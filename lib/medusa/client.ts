import Medusa from '@medusajs/js-sdk';
import {
  StoreProduct,
  StoreRegion,
  StoreCart,
  StoreCartItem,
  AtelierOrder,
  SecureDigitalDownload,
  CustomerGroupType,
  CustomerMeasurements,
} from './types';
import { STORE_REGIONS } from './regions';
import { INITIAL_PRODUCTS } from './products-data';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  'http://localhost:9000';

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

// Initialize real Medusa JS SDK client
export const medusaSdk = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
});

/**
 * Reusable Store API client abstraction layer
 */
export const medusa = {
  products: {
    async list(params?: {
      type?: 'digital_pattern' | 'physical_garment';
      category?: string;
      search?: string;
      collection?: string;
      textile?: string;
    }): Promise<StoreProduct[]> {
      let items = [...INITIAL_PRODUCTS];

      if (params?.type) {
        items = items.filter((p) => p.product_type === params.type);
      }
      if (params?.category) {
        items = items.filter((p) => p.category === params.category);
      }
      if (params?.collection) {
        items = items.filter((p) => p.collection === params.collection);
      }
      if (params?.textile) {
        items = items.filter(
          (p) =>
            p.garment_details?.textile.toLowerCase() ===
            params.textile?.toLowerCase()
        );
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return items;
    },

    async getByHandle(handle: string): Promise<StoreProduct | null> {
      const match = INITIAL_PRODUCTS.find((p) => p.handle === handle);
      return match || null;
    },

    async getById(id: string): Promise<StoreProduct | null> {
      const match = INITIAL_PRODUCTS.find((p) => p.id === id);
      return match || null;
    },
  },

  regions: {
    async list(): Promise<StoreRegion[]> {
      return STORE_REGIONS;
    },
    async getById(id: string): Promise<StoreRegion> {
      return (
        STORE_REGIONS.find((r) => r.id === id) ||
        STORE_REGIONS[0] // default to Bangladesh
      );
    },
  },

  cart: {
    create(regionId?: string): StoreCart {
      const region =
        STORE_REGIONS.find((r) => r.id === regionId) || STORE_REGIONS[0];
      return {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        items: [],
        region,
        has_physical_items: false,
        has_digital_items: false,
        subtotal: 0,
        tax_total: 0,
        shipping_total: 0,
        total: 0,
      };
    },

    recalculate(
      cart: StoreCart,
      customerGroup: CustomerGroupType = 'Standard'
    ): StoreCart {
      const currency = cart.region.currency_code;
      let subtotal = 0;
      let hasPhysical = false;
      let hasDigital = false;

      const updatedItems = cart.items.map((item) => {
        const prod = INITIAL_PRODUCTS.find((p) => p.id === item.product_id);
        const originalBase =
          prod?.base_prices[currency] || item.original_unit_price || 0;

        let activeUnitPrice = originalBase;
        let isWholesale = false;
        let discountLabel: string | undefined;

        // B2B 40% wholesale pricing on digital patterns from backend pricing mechanism
        if (
          item.product_type === 'digital_pattern' &&
          (customerGroup === 'Boutique' || customerGroup === 'Educator')
        ) {
          const wholesaleAmount = prod?.wholesale_prices?.[currency];
          if (wholesaleAmount !== undefined) {
            activeUnitPrice = wholesaleAmount;
            isWholesale = true;
            discountLabel = `40% ${customerGroup} Wholesale Tier`;
          }
        }

        const itemTotal = activeUnitPrice * item.quantity;
        subtotal += itemTotal;

        if (item.product_type === 'physical_garment') {
          hasPhysical = true;
        } else {
          hasDigital = true;
        }

        return {
          ...item,
          unit_price: activeUnitPrice,
          original_unit_price: originalBase,
          is_b2b_discounted: isWholesale,
          discount_label: discountLabel,
          total_price: itemTotal,
        };
      });

      // Digital-only cart has NO physical shipping
      const shippingCost = hasPhysical
        ? cart.shipping_option?.amount ?? cart.region.default_shipping_cost
        : 0;

      // Tax calculation per region
      const taxAmount = subtotal * cart.region.tax_rate;
      const total = subtotal + taxAmount + shippingCost;

      return {
        ...cart,
        items: updatedItems,
        has_physical_items: hasPhysical,
        has_digital_items: hasDigital,
        subtotal,
        tax_total: taxAmount,
        shipping_total: shippingCost,
        total,
      };
    },
  },
};
