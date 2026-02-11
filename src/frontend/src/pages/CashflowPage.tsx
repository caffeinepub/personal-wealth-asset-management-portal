import { useState } from 'react';
import CashflowSummaryCards from '@/features/cashflow/components/CashflowSummaryCards';
import CashflowEntryFormCard from '@/features/cashflow/components/CashflowEntryFormCard';
import CashflowEntriesTable from '@/features/cashflow/components/CashflowEntriesTable';
import { useListCashflowEntries, useGetCashflowSummary } from '@/features/cashflow/api';
import type { CashflowEntry } from '@/backend';

export default function CashflowPage() {
  const [editingEntry, setEditingEntry] = useState<CashflowEntry | null>(null);
  const { data: entries = [], isLoading: entriesLoading } = useListCashflowEntries();
  const { data: summary, isLoading: summaryLoading } = useGetCashflowSummary();

  const handleEdit = (entry: CashflowEntry) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setEditingEntry(null);
  };

  if (entriesLoading || summaryLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading cashflow data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cashflow Management</h1>
        <p className="text-muted-foreground mt-2">
          Track money to collect and money to give
        </p>
      </div>

      {summary && (
        <CashflowSummaryCards
          totalToCollect={summary.totalCredit}
          totalToGive={summary.totalDebit}
          netBalance={summary.netBalance}
        />
      )}

      <CashflowEntryFormCard editingEntry={editingEntry} onSuccess={handleSuccess} />

      <CashflowEntriesTable entries={entries} onEdit={handleEdit} />
    </div>
  );
}
