import { useState } from 'react';
import { useListLoans } from '@/features/lending/api';
import LoanFormCard from '@/features/lending/components/LoanFormCard';
import LoansTable from '@/features/lending/components/LoansTable';
import LendingInsights from '@/features/lending/components/LendingInsights';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Loan } from '@/backend';

export default function MoneyLendingPage() {
  const { data: loans, isLoading } = useListLoans();
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const handleEditSuccess = () => {
    setEditingLoan(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Money Lending & Interest Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Manage your loans and track interest income
        </p>
      </div>

      <LoanFormCard editingLoan={editingLoan} onSuccess={handleEditSuccess} />

      {loans && loans.length > 0 && (
        <>
          <LoansTable loans={loans} onEdit={setEditingLoan} />
          <LendingInsights loans={loans} />
        </>
      )}

      {loans && loans.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No loans yet. Add your first loan above to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
