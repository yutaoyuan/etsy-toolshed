/**
 * Etsy 费率与利润计算
 *
 * 所有金额、费率集中在此文件维护，组件不写死费率。
 * 默认费率值基于 Etsy 官方公布的费率（transaction 6.5%、listing $0.20 等），
 * 作为 Supabase fee_rates 表无 active 数据时的降级值。
 * 生产环境优先从 Supabase 读取（lib/feeCache.ts），可在后台更新而无需重新部署。
 *
 * 支持国家：US / UK / CA / EU / AU。
 */

export type CountryCode = "US" | "UK" | "CA" | "EU" | "AU";

export interface CountryFeeConfig {
  code: CountryCode;
  name: string;
  currency: string;
  /** 交易费率（对 item price + shipping 收取） */
  transactionFeeRate: number;
  /** 上架费（每件） */
  listingFee: number;
  /** 支付处理费率 */
  paymentProcessingRate: number;
  /** 支付处理固定费用 */
  paymentProcessingFixed: number;
  /** Offsite Ads 费率（年销售额 < $10k） */
  offsiteAdsRateLow: number;
  /** Offsite Ads 费率（年销售额 >= $10k） */
  offsiteAdsRateHigh: number;
}

/**
 * 各国费率表。
 * 金额单位：对应货币（US/CA/AU 为元，UK 为英镑，EU 为欧元）。
 * 注意：P0 阶段未做汇率换算，输入与输出均按所选国家货币计算。
 */
export const COUNTRY_FEES: Record<CountryCode, CountryFeeConfig> = {
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    transactionFeeRate: 0.065,
    listingFee: 0.2,
    paymentProcessingRate: 0.03,
    paymentProcessingFixed: 0.25,
    offsiteAdsRateLow: 0.15,
    offsiteAdsRateHigh: 0.12,
  },
  UK: {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    transactionFeeRate: 0.065,
    listingFee: 0.2,
    paymentProcessingRate: 0.04,
    paymentProcessingFixed: 0.2,
    offsiteAdsRateLow: 0.15,
    offsiteAdsRateHigh: 0.12,
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    transactionFeeRate: 0.065,
    listingFee: 0.2,
    paymentProcessingRate: 0.03,
    paymentProcessingFixed: 0.25,
    offsiteAdsRateLow: 0.15,
    offsiteAdsRateHigh: 0.12,
  },
  EU: {
    code: "EU",
    name: "European Union",
    currency: "EUR",
    transactionFeeRate: 0.065,
    listingFee: 0.2,
    paymentProcessingRate: 0.03,
    paymentProcessingFixed: 0.25,
    offsiteAdsRateLow: 0.15,
    offsiteAdsRateHigh: 0.12,
  },
  AU: {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    transactionFeeRate: 0.065,
    listingFee: 0.2,
    paymentProcessingRate: 0.03,
    paymentProcessingFixed: 0.25,
    offsiteAdsRateLow: 0.15,
    offsiteAdsRateHigh: 0.12,
  },
};

export interface ProfitInput {
  salePrice: number;
  shipping: number;
  cost: number;
  labor: number;
  packaging: number;
  country: CountryCode;
  offsiteAds: boolean;
  /** 年销售额是否达到 $10k（影响 offsite ads 费率） */
  highVolume: boolean;
  /** 销量（件） */
  salesVolume: number;
}

export interface FeeBreakdown {
  transactionFee: number;
  listingFee: number;
  paymentProcessingFee: number;
  offsiteAdsFee: number;
  totalEtsyFees: number;
}

export interface ProfitResult {
  revenue: number;
  fees: FeeBreakdown;
  productCosts: number;
  netProfit: number;
  profitMargin: number;
  /** 保本最低售价（利润率 0%） */
  breakEvenPrice: number;
  /** 达到 30% 利润率的最低售价 */
  minPriceFor30Margin: number;
}

/**
 * Supabase fee_rates 表的一行（snake_case 列名）。
 */
export interface FeeRateRow {
  country: string;
  transaction_rate: number;
  listing_fee: number;
  payment_processing_rate: number;
  payment_processing_fixed: number;
  offsite_ads_low: number;
  offsite_ads_high: number;
}

/**
 * 把 fee_rates 行映射为 CountryFeeConfig（字段名转换 + 类型断言）。
 */
export function feeRowToConfig(row: FeeRateRow): CountryFeeConfig {
  return {
    code: row.country as CountryCode,
    name: COUNTRY_FEES[row.country as CountryCode]?.name ?? row.country,
    currency: COUNTRY_FEES[row.country as CountryCode]?.currency ?? "USD",
    transactionFeeRate: Number(row.transaction_rate),
    listingFee: Number(row.listing_fee),
    paymentProcessingRate: Number(row.payment_processing_rate),
    paymentProcessingFixed: Number(row.payment_processing_fixed),
    offsiteAdsRateLow: Number(row.offsite_ads_low),
    offsiteAdsRateHigh: Number(row.offsite_ads_high),
  };
}

/** 金额保留 2 位小数 */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * 计算单件利润。
 * 收入 = salePrice + shipping（买家支付的运费计入收入）。
 * 成本 = cost + labor + packaging。
 *
 * @param input 计算输入
 * @param feeConfig 可选费率覆盖（来自 Supabase fee_rates active 行）。
 *                  未提供或字段缺失时回退到 COUNTRY_FEES 默认值。
 */
export function calculateProfit(
  input: ProfitInput,
  feeConfig?: Partial<CountryFeeConfig>,
): ProfitResult {
  const defaults = COUNTRY_FEES[input.country];
  const cfg: CountryFeeConfig = { ...defaults, ...feeConfig };
  const revenue = input.salePrice + input.shipping;

  const offsiteRate = input.highVolume
    ? cfg.offsiteAdsRateHigh
    : cfg.offsiteAdsRateLow;
  const variableRate =
    cfg.transactionFeeRate +
    cfg.paymentProcessingRate +
    (input.offsiteAds ? offsiteRate : 0);

  const transactionFee = revenue * cfg.transactionFeeRate;
  const listingFee = cfg.listingFee;
  const paymentProcessingFee =
    revenue * cfg.paymentProcessingRate + cfg.paymentProcessingFixed;
  const offsiteAdsFee = input.offsiteAds ? revenue * offsiteRate : 0;
  const totalEtsyFees =
    transactionFee + listingFee + paymentProcessingFee + offsiteAdsFee;

  const productCosts = input.cost + input.labor + input.packaging;
  const netProfit = revenue - totalEtsyFees - productCosts;
  const profitMargin = revenue > 0 ? netProfit / revenue : 0;

  const fixedCosts =
    cfg.listingFee + cfg.paymentProcessingFixed + productCosts;

  // 反推最低售价：(fixedCosts) / (1 - variableRate) - shipping
  const denomBreakEven = 1 - variableRate;
  const breakEvenPrice =
    denomBreakEven > 0 ? fixedCosts / denomBreakEven - input.shipping : 0;

  // 目标利润率 30%：P = fixedCosts / (1 - variableRate - 0.3) - shipping
  const targetMargin = 0.3;
  const denomTarget = 1 - variableRate - targetMargin;
  const minPriceFor30Margin =
    denomTarget > 0 ? fixedCosts / denomTarget - input.shipping : 0;

  return {
    revenue: round2(revenue),
    fees: {
      transactionFee: round2(transactionFee),
      listingFee: round2(listingFee),
      paymentProcessingFee: round2(paymentProcessingFee),
      offsiteAdsFee: round2(offsiteAdsFee),
      totalEtsyFees: round2(totalEtsyFees),
    },
    productCosts: round2(productCosts),
    netProfit: round2(netProfit),
    profitMargin: round2(profitMargin * 100),
    breakEvenPrice: round2(Math.max(0, breakEvenPrice)),
    minPriceFor30Margin: round2(Math.max(0, minPriceFor30Margin)),
  };
}
