import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { netWorth, totalPropertyValue, totalLendingPortfolio, totalWealthInputs } from '@/storage/aggregates';
import { listLoans } from '@/storage/loansRepo';

export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: async () => {
      const [netWorthValue, propertyValue, lendingPortfolio, wealthInputsTotal, loans] = await Promise.all([
        netWorth(),
        totalPropertyValue(),
        totalLendingPortfolio(),
        totalWealthInputs(),
        listLoans(),
      ]);

      // Calculate monthly cash flow from loans
      const monthlyCashFlow = loans.reduce((total, loan) => {
        const rate = loan.interestRate / 100;
        const monthlyInterest = loan.termMonthly 
          ? loan.principal * rate
          : (loan.principal * rate) / 12;
        return total + monthlyInterest;
      }, 0);

      return {
        netWorth: netWorthValue,
        propertyValue,
        lendingPortfolio,
        wealthInputsTotal,
        monthlyCashFlow,
      };
    },
  });
}
