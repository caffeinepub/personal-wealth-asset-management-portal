export const queryKeys = {
  loans: {
    all: ['loans'] as const,
    list: () => [...queryKeys.loans.all, 'list'] as const,
    detail: (id: bigint) => [...queryKeys.loans.all, 'detail', id] as const,
  },
  properties: {
    all: ['properties'] as const,
    list: () => [...queryKeys.properties.all, 'list'] as const,
    detail: (id: bigint) => [...queryKeys.properties.all, 'detail', id] as const,
  },
  wealthInputs: {
    all: ['wealthInputs'] as const,
    list: () => [...queryKeys.wealthInputs.all, 'list'] as const,
    latest: () => [...queryKeys.wealthInputs.all, 'latest'] as const,
  },
  aggregates: {
    all: ['aggregates'] as const,
    netWorth: () => [...queryKeys.aggregates.all, 'netWorth'] as const,
    propertyValue: () => [...queryKeys.aggregates.all, 'propertyValue'] as const,
    lendingPortfolio: () => [...queryKeys.aggregates.all, 'lendingPortfolio'] as const,
    wealthInputsTotal: () => [...queryKeys.aggregates.all, 'wealthInputsTotal'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
  },
  userProfile: {
    all: ['userProfile'] as const,
    current: () => [...queryKeys.userProfile.all, 'current'] as const,
  },
  cashflow: {
    all: ['cashflow'] as const,
    list: () => [...queryKeys.cashflow.all, 'list'] as const,
    summary: () => [...queryKeys.cashflow.all, 'summary'] as const,
    detail: (id: bigint) => [...queryKeys.cashflow.all, 'detail', id] as const,
  },
  dailyPL: {
    all: ['dailyPL'] as const,
    report: () => [...queryKeys.dailyPL.all, 'report'] as const,
  },
  mpl: {
    all: ['mpl'] as const,
    matches: () => [...queryKeys.mpl.all, 'matches'] as const,
    matchDetail: (matchId: string) => [...queryKeys.mpl.all, 'match', matchId] as const,
    entries: (matchId: string) => [...queryKeys.mpl.all, 'entries', matchId] as const,
    plSummary: (matchId: string) => [...queryKeys.mpl.all, 'plSummary', matchId] as const,
  },
};
