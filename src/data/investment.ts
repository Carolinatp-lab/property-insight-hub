import type { InvestmentBaseline, InvestmentScenario } from "@/domain/investment-analysis";

/**
 * Normaliserade exempelvärden för prototypen. De ersätts senare av analys
 * av föreningens gemensamma interna datamodell.
 */
export const investmentBaseline: InvestmentBaseline = {
  liquidAssets: 4_500_000,
  annualFeeRevenue: 4_248_000,
  totalDebt: 28_540_000,
  totalAreaSqm: 5_467,
  currentAnnualSaving: 667_000,
  minimumLiquidityBuffer: 1_500_000,
  referenceApartmentSqm: 70,
};

export const roofScenario: InvestmentScenario = {
  name: "Takrenovering",
  investmentAmount: 6_000_000,
  ownFunds: 2_500_000,
  interestRate: 3.8,
  amortizationYears: 30,
  plannedYear: 2028,
};
