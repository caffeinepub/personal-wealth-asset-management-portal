import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';

export function useDashboardOverview() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const [netWorth, propertyValue, lendingPortfolio, wealthInputsTotal, loans] = await Promise.all([
        actor.netWorth(),
        actor.totalPropertyValue(),
        actor.totalLendingPortfolio(),
        actor.totalWealthInputs(),
        actor.listLoans(),
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
        netWorth,
        propertyValue,
        lendingPortfolio,
        wealthInputsTotal,
        monthlyCashFlow,
      };
    },
    enabled: !!actor && !actorFetching,
  });
}
