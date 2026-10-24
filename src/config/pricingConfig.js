/**
 * Central Pricing Configuration & Calculation Engine
 * Designed for kiosk self-service with clear itemization and future backend sync.
 */

export const PRICING_RULES = {
  currencySymbol: '₹',
  currencyCode: 'INR',

  // Cost per page according to color mode
  colorModes: {
    bw: {
      id: 'bw',
      label: 'Black & White',
      basePricePerPage: 2.00,
      description: 'High-contrast monochrome laser print (600 DPI)'
    },
    color: {
      id: 'color',
      label: 'Full Colour',
      basePricePerPage: 10.00,
      description: 'Vibrant CMYK laser graphics & photographic grade (1200 DPI)'
    }
  },

  // Paper size surcharges (per physical sheet)
  paperSizes: {
    a4: {
      id: 'a4',
      label: 'A4 (210 × 297 mm)',
      sheetSurcharge: 0.00,
      weight: '75 GSM Premium'
    },
    a3: {
      id: 'a3',
      label: 'A3 (297 × 420 mm)',
      sheetSurcharge: 3.00,
      weight: '90 GSM Presentation'
    },
    letter: {
      id: 'letter',
      label: 'Letter (8.5 × 11 in)',
      sheetSurcharge: 0.50,
      weight: '75 GSM Standard'
    }
  },

  // Sides pricing: double-sided prints save paper sheets
  sides: {
    single: {
      id: 'single',
      label: 'Single-sided',
      sheetFactor: 1.0,
      discountPerPage: 0.00
    },
    double: {
      id: 'double',
      label: 'Double-sided (Duplex)',
      sheetFactor: 0.5,
      // Duplex eco-saving incentive: 10% discount on print cost
      discountPercentage: 0.10
    }
  },

  // AI Enhancement service
  aiAssistance: {
    fee: 0.00, // FREE promotion for kiosk users
    promotionalNotice: 'Free AI auto-rotation & contrast enhancement included'
  },

  // Tax rates (e.g. GST)
  taxRate: 0.00, // Zero or tax inclusive on self-service kiosk
  minCharge: 2.00
};

/**
 * Calculates itemized pricing based on document pages and print settings
 * @param {Object} options 
 * @returns {Object} itemized breakdown
 */
export function calculatePrintPrice({
  totalPages = 1,
  selectedPages = [],
  copies = 1,
  colorMode = 'bw',
  paperSize = 'a4',
  printSides = 'single'
}) {
  const effectivePagesCount = selectedPages && selectedPages.length > 0 
    ? selectedPages.length 
    : Math.max(1, totalPages);

  const safeCopies = Math.max(1, parseInt(copies, 10) || 1);
  const modeConfig = PRICING_RULES.colorModes[colorMode] || PRICING_RULES.colorModes.bw;
  const paperConfig = PRICING_RULES.paperSizes[paperSize] || PRICING_RULES.paperSizes.a4;
  const sidesConfig = PRICING_RULES.sides[printSides] || PRICING_RULES.sides.single;

  // Base print price per page
  const rawPagePrice = modeConfig.basePricePerPage;
  
  // Calculate discount if double-sided
  const discountPerSide = printSides === 'double' ? rawPagePrice * (sidesConfig.discountPercentage || 0) : 0;
  const effectivePagePrice = rawPagePrice - discountPerSide;

  // Total page impressions across all copies
  const totalImpressions = effectivePagesCount * safeCopies;
  const printCostSubtotal = totalImpressions * effectivePagePrice;

  // Physical paper sheets calculation
  const sheetsPerCopy = printSides === 'double' 
    ? Math.ceil(effectivePagesCount / 2) 
    : effectivePagesCount;
  const totalSheets = sheetsPerCopy * safeCopies;

  // Paper size additional surcharge
  const paperSurchargeTotal = totalSheets * paperConfig.sheetSurcharge;

  // Subtotal before tax
  const subtotal = Math.max(PRICING_RULES.minCharge, printCostSubtotal + paperSurchargeTotal);
  
  // Taxes
  const taxAmount = subtotal * PRICING_RULES.taxRate;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    currencySymbol: PRICING_RULES.currencySymbol,
    currencyCode: PRICING_RULES.currencyCode,
    effectivePagesCount,
    copies: safeCopies,
    totalImpressions,
    sheetsPerCopy,
    totalSheets,
    colorMode,
    colorModeLabel: modeConfig.label,
    basePricePerPage: modeConfig.basePricePerPage,
    paperSize,
    paperSizeLabel: paperConfig.label,
    paperSurchargePerSheet: paperConfig.sheetSurcharge,
    paperSurchargeTotal,
    printSides,
    printSidesLabel: sidesConfig.label,
    isDuplexDiscountApplied: printSides === 'double',
    duplexSavings: printSides === 'double' ? (totalImpressions * discountPerSide) : 0,
    printCostSubtotal,
    taxAmount,
    taxRatePercentage: (PRICING_RULES.taxRate * 100).toFixed(0) + '%',
    grandTotal: grandTotal.toFixed(2),
    grandTotalNumber: grandTotal
  };
}
