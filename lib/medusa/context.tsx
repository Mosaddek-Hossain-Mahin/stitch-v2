'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  StoreRegion,
  StoreCart,
  StoreCartItem,
  StoreCustomer,
  AtelierOrder,
  SecureDigitalDownload,
  CustomerGroupType,
  CustomerMeasurements,
  StoreProduct,
  AtelierProductionStage,
} from './types';
import { STORE_REGIONS, formatPrice as baseFormatPrice } from './regions';
import { medusa } from './client';

interface MedusaContextType {
  currentRegion: StoreRegion;
  setRegion: (regionId: string) => void;
  cart: StoreCart;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItemToCart: (
    product: StoreProduct,
    quantity?: number,
    measurements?: CustomerMeasurements,
    selectedTextile?: string,
    patternFormats?: string[]
  ) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  customer: StoreCustomer;
  setCustomerGroup: (group: CustomerGroupType) => void;
  updateCustomerMeasurements: (measurements: CustomerMeasurements) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: AtelierOrder[];
  placeOrder: (checkoutData: {
    customerName: string;
    customerEmail: string;
    shippingAddress?: any;
    paymentMethod: 'cod' | 'card_stripe' | 'bkash_nagad' | 'bank_transfer';
    measurements?: CustomerMeasurements;
  }) => Promise<AtelierOrder>;
  advanceOrderStage: (orderId: string, nextStage: AtelierProductionStage) => void;
  downloads: SecureDigitalDownload[];
  decrementDownloadCount: (downloadId: string) => Promise<{ success: boolean; remaining: number; message: string }>;
  formatPrice: (amount: number) => string;
}

const MedusaContext = createContext<MedusaContextType | null>(null);

const DEFAULT_MEASUREMENTS: CustomerMeasurements = {
  bust: 36,
  waist: 28,
  hips: 39,
  height: 165,
  shoulderWidth: 15,
  armLength: 22,
  customNotes: 'Prefer 1.5 inch ease around armholes for freedom of movement.',
};

export function MedusaProvider({ children }: { children: React.ReactNode }) {
  const [currentRegion, setCurrentRegionState] = useState<StoreRegion>(STORE_REGIONS[0]);
  const [cart, setCart] = useState<StoreCart>(() => medusa.cart.create(STORE_REGIONS[0].id));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<AtelierOrder[]>([]);
  const [downloads, setDownloads] = useState<SecureDigitalDownload[]>([
    {
      id: 'dl_padma_sample',
      order_id: 'ord_sample_982',
      order_number: 'SBD-9824',
      product_id: 'prod_pattern_01',
      product_title: 'Padma Peplum Blouse & Tunic Pattern',
      file_name: 'Padma_Peplum_XS-5XL_Graded_A0_A4_Projector.zip',
      file_size_mb: 28.4,
      format_type: 'Complete Pattern Suite (ZIP)',
      downloads_used: 1,
      max_downloads: 5,
      signed_s3_url: 'https://s3.ap-southeast-1.amazonaws.com/stitchbd-patterns/secure/Padma_Graded_Suite_signed.zip',
      expires_at: '2027-10-04T00:00:00Z',
      licensed_to: 'Tasnim Chowdhury (atelier.client@stitchbd.com)',
    },
  ]);

  const [customer, setCustomer] = useState<StoreCustomer>({
    id: 'cust_01stitch',
    email: 'atelier.client@stitchbd.com',
    first_name: 'Tasnim',
    last_name: 'Chowdhury',
    customer_group: 'Standard',
    b2b_verified: false,
    measurements: DEFAULT_MEASUREMENTS,
    orders: [],
    downloads: [],
  });

  // Client-side hydration from storage after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedRegion = localStorage.getItem('stitch_bd_region');
        if (savedRegion) {
          const match = STORE_REGIONS.find((r) => r.id === savedRegion);
          if (match) {
            setCurrentRegionState(match);
            setCart((c) => ({ ...c, region: match }));
          }
        }

        const savedGroup = localStorage.getItem('stitch_bd_customer_group') as CustomerGroupType | null;
        if (savedGroup) {
          setCustomer((c) => ({
            ...c,
            customer_group: savedGroup,
            b2b_verified: savedGroup !== 'Standard',
            b2b_organization:
              savedGroup === 'Boutique'
                ? 'Bengal Modern Sartorialists Ltd.'
                : savedGroup === 'Educator'
                ? 'Dhaka Institute of Fashion & Textile Arts'
                : undefined,
          }));
        }

        const savedWishlist = localStorage.getItem('stitch_bd_wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        const savedOrders = localStorage.getItem('stitch_bd_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        const savedDownloads = localStorage.getItem('stitch_bd_downloads');
        if (savedDownloads) setDownloads(JSON.parse(savedDownloads));

        const savedMeas = localStorage.getItem('stitch_bd_measurements');
        if (savedMeas) setCustomer((c) => ({ ...c, measurements: JSON.parse(savedMeas) }));
      } catch {}
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Explicit handlers that keep cart synchronized without cascading effect updates
  const setRegion = (regionId: string) => {
    const found = STORE_REGIONS.find((r) => r.id === regionId);
    if (found) {
      setCurrentRegionState(found);
      setCart((prev) => {
        const updated = { ...prev, region: found };
        return medusa.cart.recalculate(updated, customer.customer_group);
      });
      try {
        localStorage.setItem('stitch_bd_region', found.id);
      } catch {}
    }
  };

  const setCustomerGroup = (group: CustomerGroupType) => {
    setCustomer((prev) => {
      const nextCustomer: StoreCustomer = {
        ...prev,
        customer_group: group,
        b2b_verified: group !== 'Standard',
        b2b_organization:
          group === 'Boutique'
            ? 'Bengal Modern Sartorialists Ltd.'
            : group === 'Educator'
            ? 'Dhaka Institute of Fashion & Textile Arts'
            : undefined,
      };
      setCart((c) => medusa.cart.recalculate(c, group));
      return nextCustomer;
    });

    try {
      localStorage.setItem('stitch_bd_customer_group', group);
    } catch {}
  };

  const updateCustomerMeasurements = (measurements: CustomerMeasurements) => {
    setCustomer((prev) => ({ ...prev, measurements }));
    try {
      localStorage.setItem('stitch_bd_measurements', JSON.stringify(measurements));
    } catch {}
  };

  const addItemToCart = (
    product: StoreProduct,
    quantity = 1,
    measurements?: CustomerMeasurements,
    selectedTextile?: string,
    patternFormats?: string[]
  ) => {
    setCart((prev) => {
      const existingIdx = prev.items.findIndex(
        (i) => i.product_id === product.id && i.product_type === product.product_type
      );

      let newItems = [...prev.items];
      const currency = currentRegion.currency_code;
      const basePrice = product.base_prices[currency] || 1000;

      if (existingIdx > -1 && product.product_type === 'digital_pattern') {
        newItems[existingIdx].quantity += quantity;
      } else {
        const newItem: StoreCartItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          product_id: product.id,
          variant_id: product.variants[0]?.id || `var_${product.id}`,
          title: product.title,
          product_title: product.title,
          thumbnail: product.thumbnail,
          product_type: product.product_type,
          quantity,
          unit_price: basePrice,
          original_unit_price: basePrice,
          is_b2b_discounted: false,
          total_price: basePrice * quantity,
          measurements: measurements || customer.measurements,
          selected_textile: (selectedTextile as any) || product.garment_details?.textile,
          pattern_format_selection: patternFormats || ['A0 Copy-Shop', 'A4 Home', 'US Letter', 'Projector (Layers)'],
        };
        newItems.push(newItem);
      }

      const updatedCart: StoreCart = {
        ...prev,
        items: newItems,
      };

      return medusa.cart.recalculate(updatedCart, customer.customer_group);
    });

    setIsCartOpen(true);
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeCartItem(itemId);
      return;
    }
    setCart((prev) => {
      const newItems = prev.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      return medusa.cart.recalculate({ ...prev, items: newItems }, customer.customer_group);
    });
  };

  const removeCartItem = (itemId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((i) => i.id !== itemId);
      return medusa.cart.recalculate({ ...prev, items: newItems }, customer.customer_group);
    });
  };

  const clearCart = () => {
    setCart(medusa.cart.create(currentRegion.id));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem('stitch_bd_wishlist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const placeOrder = async (checkoutData: {
    customerName: string;
    customerEmail: string;
    shippingAddress?: any;
    paymentMethod: 'cod' | 'card_stripe' | 'bkash_nagad' | 'bank_transfer';
    measurements?: CustomerMeasurements;
  }): Promise<AtelierOrder> => {
    const orderNumber = `SBD-${Math.floor(1000 + Math.random() * 9000)}`;
    const hasPhysical = cart.has_physical_items;
    const hasDigital = cart.has_digital_items;

    const newDownloads: SecureDigitalDownload[] = [];
    cart.items
      .filter((i) => i.product_type === 'digital_pattern')
      .forEach((item, idx) => {
        newDownloads.push({
          id: `dl_${Date.now()}_${idx}`,
          order_id: `ord_${orderNumber}`,
          order_number: orderNumber,
          product_id: item.product_id,
          product_title: item.product_title,
          file_name: `${item.product_title.replace(/\s+/g, '_')}_XS-5XL_Complete_Suite.zip`,
          file_size_mb: 32.5,
          format_type: 'Complete Pattern Suite (ZIP)',
          downloads_used: 0,
          max_downloads: 5,
          signed_s3_url: `https://s3.ap-southeast-1.amazonaws.com/stitchbd-patterns/secure/${orderNumber}-${item.product_id}-signed.zip`,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          licensed_to: `${checkoutData.customerName} (${checkoutData.customerEmail})`,
        });
      });

    const newOrder: AtelierOrder = {
      id: `ord_${orderNumber}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
      status: 'in_production',
      payment_status: checkoutData.paymentMethod === 'cod' ? 'cod_pending' : 'paid',
      total: cart.total,
      currency_code: cart.region.currency_code,
      customer_name: checkoutData.customerName,
      customer_email: checkoutData.customerEmail,
      has_physical_items: hasPhysical,
      has_digital_items: hasDigital,
      items: [...cart.items],
      production_stage: hasPhysical ? 'measurements_review' : undefined,
      stage_updated_at: new Date().toISOString(),
      production_notes: hasPhysical
        ? ['Order received at Dhaka Atelier. Master tailor reviewing submitted anatomical measurements.']
        : ['Digital purchase finalized. Instant signed S3 download licenses granted.'],
      tracking_number: hasPhysical ? `BD-EXP-${orderNumber}` : undefined,
      downloads: newDownloads,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      localStorage.setItem('stitch_bd_orders', JSON.stringify(updatedOrders));
    } catch {}

    if (newDownloads.length > 0) {
      const updatedDownloads = [...newDownloads, ...downloads];
      setDownloads(updatedDownloads);
      try {
        localStorage.setItem('stitch_bd_downloads', JSON.stringify(updatedDownloads));
      } catch {}
    }

    clearCart();
    return newOrder;
  };

  const advanceOrderStage = (orderId: string, nextStage: AtelierProductionStage) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          const notes = [...(ord.production_notes || [])];
          if (nextStage === 'textile_preparation') {
            notes.unshift('Authentic handwoven textile inspected and washed in mineral-balanced water.');
          } else if (nextStage === 'cutting') {
            notes.unshift('Master cutter aligned geometric warp & weft motifs and cut individual pattern panels.');
          } else if (nextStage === 'stitching') {
            notes.unshift('Tailored with precision French seams and silk thread edge basting.');
          } else if (nextStage === 'qc') {
            notes.unshift('Quality control audit passed: tolerance within 2mm, pressing and hand-finished button loops verified.');
          } else if (nextStage === 'shipping') {
            notes.unshift('Packaged in mulberry bark paper and dispatched via express courier.');
          } else if (nextStage === 'delivered') {
            notes.unshift('Hand-delivered to client.');
          }
          return {
            ...ord,
            production_stage: nextStage,
            stage_updated_at: new Date().toISOString(),
            production_notes: notes,
            status: nextStage === 'delivered' ? ('completed' as const) : ('in_production' as const),
          };
        }
        return ord;
      });
      try {
        localStorage.setItem('stitch_bd_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const decrementDownloadCount = async (
    downloadId: string
  ): Promise<{ success: boolean; remaining: number; message: string }> => {
    const item = downloads.find((d) => d.id === downloadId);
    if (!item) {
      return { success: false, remaining: 0, message: 'License file not found.' };
    }

    if (item.downloads_used >= item.max_downloads) {
      return {
        success: false,
        remaining: 0,
        message: `Download allowance reached (${item.max_downloads} of ${item.max_downloads} used). Contact atelier support.`,
      };
    }

    const nextUsed = item.downloads_used + 1;
    const remaining = item.max_downloads - nextUsed;

    const updated = downloads.map((d) =>
      d.id === downloadId ? { ...d, downloads_used: nextUsed } : d
    );
    setDownloads(updated);
    try {
      localStorage.setItem('stitch_bd_downloads', JSON.stringify(updated));
    } catch {}

    return {
      success: true,
      remaining,
      message: `Signed S3 URL verified. Download initiated (${remaining} remaining).`,
    };
  };

  const formatPrice = (amount: number) => {
    return baseFormatPrice(amount, currentRegion.currency_code);
  };

  return (
    <MedusaContext.Provider
      value={{
        currentRegion,
        setRegion,
        cart,
        isCartOpen,
        setIsCartOpen,
        addItemToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        customer,
        setCustomerGroup,
        updateCustomerMeasurements,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        advanceOrderStage,
        downloads,
        decrementDownloadCount,
        formatPrice,
      }}
    >
      {children}
    </MedusaContext.Provider>
  );
}

export function useMedusa() {
  const ctx = useContext(MedusaContext);
  if (!ctx) {
    throw new Error('useMedusa must be used within a MedusaProvider');
  }
  return ctx;
}
