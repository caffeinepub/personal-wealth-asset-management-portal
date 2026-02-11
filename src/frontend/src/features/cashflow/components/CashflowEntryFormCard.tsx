import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAddOrUpdateCashflowEntry } from '../api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CashflowEntry, CashflowEntryType } from '@/backend';

interface CashflowEntryFormCardProps {
  editingEntry?: CashflowEntry | null;
  onSuccess?: () => void;
}

export default function CashflowEntryFormCard({ editingEntry, onSuccess }: CashflowEntryFormCardProps) {
  const [description, setDescription] = useState('');
  const [collectAmount, setCollectAmount] = useState('');
  const [giveAmount, setGiveAmount] = useState('');

  const addOrUpdateMutation = useAddOrUpdateCashflowEntry();

  useEffect(() => {
    if (editingEntry) {
      setDescription(editingEntry.description);
      if (editingEntry.entryType === CashflowEntryType.credit) {
        setCollectAmount(editingEntry.amount.toString());
        setGiveAmount('');
      } else {
        setGiveAmount(editingEntry.amount.toString());
        setCollectAmount('');
      }
    }
  }, [editingEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const collectNum = parseFloat(collectAmount) || 0;
    const giveNum = parseFloat(giveAmount) || 0;

    // Validation: exactly one must be > 0
    if ((collectNum > 0 && giveNum > 0) || (collectNum === 0 && giveNum === 0)) {
      toast.error('Please enter either amount to collect OR amount to give (not both)');
      return;
    }

    if (collectNum < 0 || giveNum < 0) {
      toast.error('Please enter valid non-negative amounts');
      return;
    }

    const entryType: CashflowEntryType = collectNum > 0 ? CashflowEntryType.credit : CashflowEntryType.debit;
    const amount = collectNum > 0 ? collectNum : giveNum;

    try {
      await addOrUpdateMutation.mutateAsync({
        id: editingEntry?.id,
        description: description.trim(),
        amount,
        entryType,
      });

      toast.success(editingEntry ? 'Entry updated successfully' : 'Entry added successfully');
      
      // Reset form
      setDescription('');
      setCollectAmount('');
      setGiveAmount('');
      
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save entry');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingEntry ? 'Edit Cashflow Entry' : 'Add Cashflow Entry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Name / Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Person or business name"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="collectAmount" className="text-green-500">
                Amount to Collect (₹)
              </Label>
              <Input
                id="collectAmount"
                type="number"
                step="0.01"
                min="0"
                value={collectAmount}
                onChange={(e) => {
                  setCollectAmount(e.target.value);
                  if (e.target.value) setGiveAmount('');
                }}
                placeholder="0.00"
                className="border-green-500/30 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="giveAmount" className="text-red-500">
                Amount to Give (₹)
              </Label>
              <Input
                id="giveAmount"
                type="number"
                step="0.01"
                min="0"
                value={giveAmount}
                onChange={(e) => {
                  setGiveAmount(e.target.value);
                  if (e.target.value) setCollectAmount('');
                }}
                placeholder="0.00"
                className="border-red-500/30 focus:border-red-500"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Enter either amount to collect (money owed to you) or amount to give (money you owe)
          </p>

          <Button type="submit" className="w-full" disabled={addOrUpdateMutation.isPending}>
            {addOrUpdateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : editingEntry ? (
              'Update Entry'
            ) : (
              'Add Entry'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
