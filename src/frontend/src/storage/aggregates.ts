import { listProperties } from './propertiesRepo';
import { listLoans } from './loansRepo';
import { listWealthInputs } from './wealthInputsRepo';

export async function totalPropertyValue(): Promise<number> {
  const properties = await listProperties();
  return properties.reduce((sum, p) => sum + p.purchasePrice, 0);
}

export async function totalLendingPortfolio(): Promise<number> {
  const loans = await listLoans();
  return loans.reduce((sum, l) => sum + l.principal, 0);
}

export async function totalWealthInputs(): Promise<number> {
  const inputs = await listWealthInputs();
  if (inputs.length === 0) return 0;
  
  const latest = inputs.reduce((latest, current) => 
    current.updatedAt > latest.updatedAt ? current : latest
  );

  return latest.goldValue + latest.stocksValue + latest.cashLiquid + latest.otherAssets;
}

export async function netWorth(): Promise<number> {
  const [propertyTotal, lendingTotal, wealthTotal] = await Promise.all([
    totalPropertyValue(),
    totalLendingPortfolio(),
    totalWealthInputs(),
  ]);

  return propertyTotal + lendingTotal + wealthTotal;
}
