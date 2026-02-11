import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export function invalidateAggregates(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.aggregates.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
}

export function invalidateLoans(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
  invalidateAggregates(queryClient);
}

export function invalidateProperties(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
  invalidateAggregates(queryClient);
}

export function invalidateWealthInputs(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.wealthInputs.all });
  invalidateAggregates(queryClient);
}

export function invalidateCashflow(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.cashflow.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dailyPL.all });
}

export function invalidateMpl(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.mpl.all });
}
