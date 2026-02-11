import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAddOrUpdateLoan } from '../api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStorageErrorMessage, logStorageError } from '@/utils/storageErrors';
import type { Loan } from '@/backend';

interface LoanFormCardProps {
  editingLoan?: Loan | null;
  onSuccess?: () => void;
}

export default function LoanFormCard({ editingLoan, onSuccess }: LoanFormCardProps) {
  const [borrowerName, setBorrowerName] = useState('');
  const [collateral, setCollateral] = useState('');
  const [principal, setPrincipal] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termMonthly, setTermMonthly] = useState(true);

  const addOrUpdateMutation = useAddOrUpdateLoan();

  useEffect(() => {
    if (editingLoan) {
      setBorrowerName(editingLoan.borrowerName);
      setCollateral(editingLoan.collateral);
      setPrincipal(editingLoan.principal.toString());
      setLoanTenure(editingLoan.loanTenure.toString());
      setInterestRate(editingLoan.interestRate.toString());
      setTermMonthly(editingLoan.termMonthly);
    }
  }, [editingLoan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const principalNum = parseFloat(principal);
    const tenureNum = parseFloat(loanTenure);
    const rateNum = parseFloat(interestRate);

    if (principalNum <= 0 || rateNum < 0) {
      toast.error('Please enter valid positive numbers');
      return;
    }

    if (!loanTenure || tenureNum <= 0) {
      toast.error('Please enter a valid tenure greater than 0');
      return;
    }

    try {
      await addOrUpdateMutation.mutateAsync({
        id: editingLoan?.id,
        borrowerName: borrowerName.trim(),
        collateral: collateral.trim(),
        principal: principalNum,
        loanTenure: tenureNum,
        interestRate: rateNum,
        termMonthly,
      });

      toast.success(editingLoan ? 'Loan updated successfully' : 'Loan added successfully');
      
      // Reset form
      setBorrowerName('');
      setCollateral('');
      setPrincipal('');
      setLoanTenure('');
      setInterestRate('');
      setTermMonthly(true);
      
      onSuccess?.();
    } catch (error) {
      logStorageError('save loan', error);
      const errorMessage = getStorageErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingLoan ? 'Edit Loan' : 'Add New Loan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="borrowerName">Borrower Name</Label>
              <Input
                id="borrowerName"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collateral">Collateral / Security</Label>
              <Input
                id="collateral"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                placeholder="Property deed, vehicle title, etc."
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal Amount (₹)</Label>
              <Input
                id="principal"
                type="number"
                step="0.01"
                min="0"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="10000.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanTenure">
                Tenure ({termMonthly ? 'months' : 'years'})
              </Label>
              <Input
                id="loanTenure"
                type="number"
                step="0.01"
                min="0"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                placeholder={termMonthly ? '12' : '1'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              min="0"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="5.5"
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="termMonthly">Loan Term</Label>
              <p className="text-sm text-muted-foreground">
                {termMonthly ? 'Monthly interest' : 'Yearly interest'}
              </p>
            </div>
            <Switch
              id="termMonthly"
              checked={termMonthly}
              onCheckedChange={setTermMonthly}
            />
          </div>

          <Button type="submit" className="w-full" disabled={addOrUpdateMutation.isPending}>
            {addOrUpdateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : editingLoan ? (
              'Update Loan'
            ) : (
              'Add Loan'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
