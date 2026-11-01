export interface FinancingPlan {
  id: number;
  name: string;
  apr: number;
  termMonths: number;
  minDownPaymentPct: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  badgeLabel?: string | null;
  description?: string | null;
  term_months?: number;
  min_down_payment_pct?: number;
  is_default?: boolean;
  is_active?: boolean;
  sort_order?: number;
  badge_label?: string | null;
}

export interface FinancingSettings {
  minProjectCost: number;
  maxProjectCost: number;
  defaultProjectCost: number;
  creditCheckCopyFlag: boolean;
  disclaimerText?: string | null;
  ctaText?: string | null;
  min_project_cost?: number;
  max_project_cost?: number;
  default_project_cost?: number;
  credit_check_copy_flag?: boolean;
}

export interface FinancingCalculationResult {
  monthlyPayment: number;
  principal: number;
  planName: string;
  apr: number;
  termMonths: number;
  totalInterest: number;
  totalCost: number;
  formattedMonthly: string;
  formattedPrincipal: string;
  formattedInterest: string;
  formattedTotalCost: string;
}

/**
 * Standard Loan Amortization Formula
 * principal = projectCost - downPayment
 * if apr == 0: monthly = principal / termMonths
 * else: r = (apr / 100) / 12
 *       monthly = principal * (r * (1+r)^n) / ((1+r)^n - 1)
 * Round to nearest dollar.
 */
export function calculateFinancing(
  plan: Pick<FinancingPlan, 'name' | 'apr' | 'termMonths'> & { term_months?: number },
  projectCost: number,
  downPayment = 0
): FinancingCalculationResult {
  const safeCost = Math.max(0, Number(projectCost) || 0);
  const safeDown = Math.min(safeCost, Math.max(0, Number(downPayment) || 0));
  const principal = Math.max(0, safeCost - safeDown);

  const rawTerm = plan.termMonths ?? plan.term_months ?? 12;
  const n = Math.max(1, Number(rawTerm) || 12);
  const apr = Math.max(0, Number(plan.apr) || 0);

  let monthlyPayment: number;
  let totalInterest: number;
  let totalCost: number;

  if (principal === 0) {
    monthlyPayment = 0;
    totalInterest = 0;
    totalCost = safeDown;
  } else if (apr === 0) {
    monthlyPayment = Math.round(principal / n);
    totalInterest = 0;
    totalCost = principal + safeDown;
  } else {
    const r = apr / 100 / 12;
    const factor = Math.pow(1 + r, n);
    monthlyPayment = Math.round((principal * (r * factor)) / (factor - 1));
    totalCost = monthlyPayment * n + safeDown;
    totalInterest = Math.max(0, totalCost - safeCost);
  }

  return {
    monthlyPayment,
    principal,
    planName: plan.name,
    apr,
    termMonths: n,
    totalInterest,
    totalCost,
    formattedMonthly: `$${monthlyPayment.toLocaleString()}/mo`,
    formattedPrincipal: `$${principal.toLocaleString()}`,
    formattedInterest: `$${totalInterest.toLocaleString()}`,
    formattedTotalCost: `$${totalCost.toLocaleString()}`,
  };
}
