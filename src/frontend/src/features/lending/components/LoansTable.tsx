import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useDeleteLoan } from '../api';
import { toast } from 'sonner';
import { formatInr } from '@/utils/currency';
import type { Loan } from '@/backend';

interface LoansTableProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
}

export default function LoansTable({ loans, onEdit }: LoansTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);
  const deleteMutation = useDeleteLoan();

  const handleDeleteClick = (loan: Loan) => {
    setLoanToDelete(loan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!loanToDelete) return;

    try {
      await deleteMutation.mutateAsync(loanToDelete.id);
      toast.success('Loan deleted successfully');
      setDeleteDialogOpen(false);
      setLoanToDelete(null);
    } catch (error) {
      toast.error('Failed to delete loan');
      console.error(error);
    }
  };

  const calculateTotalInterest = (loan: Loan) => {
    const rate = loan.interestRate / 100;
    const interestPerPeriod = loan.principal * rate;
    const totalInterest = interestPerPeriod * loan.loanTenure;
    return totalInterest;
  };

  const calculateTotalRepayment = (loan: Loan) => {
    return loan.principal + calculateTotalInterest(loan);
  };

  if (loans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No loans yet. Add your first loan above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Collateral</TableHead>
                  <TableHead className="text-right">Principal</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Tenure</TableHead>
                  <TableHead className="text-right">Interest</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id.toString()}>
                    <TableCell className="font-medium">{loan.borrowerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{loan.collateral}</TableCell>
                    <TableCell className="text-right">
                      {formatInr(loan.principal)}
                    </TableCell>
                    <TableCell className="text-right">{loan.interestRate}%</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                        {loan.termMonthly ? 'Monthly' : 'Yearly'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {loan.loanTenure} {loan.termMonthly ? 'months' : 'years'}
                    </TableCell>
                    <TableCell className="text-right text-accent">
                      {formatInr(calculateTotalInterest(loan))}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatInr(calculateTotalRepayment(loan))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(loan)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(loan)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the loan for {loanToDelete?.borrowerName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
