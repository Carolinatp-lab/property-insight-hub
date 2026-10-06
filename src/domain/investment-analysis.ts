/**
 * Beräkningar för investeringsscenarier.
 *
 * Lagret känner bara till normaliserade fastighetsvärden och användarens
 * antaganden. UI och källsystemformat hålls utanför beräkningarna.
 */

export type InvestmentBaseline = {
  liquidAssets: number;
  annualFeeRevenue: number;
  totalDebt: number;
  totalAreaSqm: number;
  currentAnnualSaving: number;
  minimumLiquidityBuffer: number;
  referenceApartmentSqm: number;
};

export type InvestmentScenario = {
  name: string;
  investmentAmount: number;
  ownFunds: number;
  interestRate: number;
  amortizationYears: number;
  plannedYear: number;
};

export type InvestmentResult = {
  loanRequired: number;
  liquidityAfterInvestment: number;
  liquidityBufferDifference: number;
  debtPerSqmBefore: number;
  debtPerSqmAfter: number;
  debtPerSqmChange: number;
  firstYearInterest: number;
  annualAmortization: number;
  annualFinancingCost: number;
  feeIncreasePercent: number;
  monthlyImpactReferenceApartment: number;
  fundingFromOwnFundsPercent: number;
  fundingFromLoanPercent: number;
};

function nonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateInvestmentScenario(
  baseline: InvestmentBaseline,
  scenario: InvestmentScenario,
): InvestmentResult {
  const amount = nonNegative(scenario.investmentAmount);
  const ownFunds = Math.min(nonNegative(scenario.ownFunds), amount);
  const loanRequired = Math.max(0, amount - ownFunds);
  const rate = nonNegative(scenario.interestRate) / 100;
  const years = Math.max(1, nonNegative(scenario.amortizationYears));

  const liquidityAfterInvestment = baseline.liquidAssets - ownFunds;
  const firstYearInterest = loanRequired * rate;
  const annualAmortization = loanRequired / years;
  const annualFinancingCost = firstYearInterest + annualAmortization;
  const feeIncreasePercent =
    baseline.annualFeeRevenue > 0 ? (annualFinancingCost / baseline.annualFeeRevenue) * 100 : 0;
  const monthlyImpactReferenceApartment =
    baseline.totalAreaSqm > 0
      ? ((annualFinancingCost / baseline.totalAreaSqm) * baseline.referenceApartmentSqm) / 12
      : 0;
  const debtPerSqmBefore =
    baseline.totalAreaSqm > 0 ? baseline.totalDebt / baseline.totalAreaSqm : 0;
  const debtPerSqmAfter =
    baseline.totalAreaSqm > 0 ? (baseline.totalDebt + loanRequired) / baseline.totalAreaSqm : 0;

  return {
    loanRequired,
    liquidityAfterInvestment,
    liquidityBufferDifference: liquidityAfterInvestment - baseline.minimumLiquidityBuffer,
    debtPerSqmBefore,
    debtPerSqmAfter,
    debtPerSqmChange: debtPerSqmAfter - debtPerSqmBefore,
    firstYearInterest,
    annualAmortization,
    annualFinancingCost,
    feeIncreasePercent,
    monthlyImpactReferenceApartment,
    fundingFromOwnFundsPercent: amount > 0 ? (ownFunds / amount) * 100 : 0,
    fundingFromLoanPercent: amount > 0 ? (loanRequired / amount) * 100 : 0,
  };
}
