import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Loader2 } from 'lucide-react';
import { useSettleMatch } from '../api';
import { toast } from 'sonner';
import { Match } from '@/backend';

interface SettleMatchDialogProps {
  match: Match;
}

export default function SettleMatchDialog({ match }: SettleMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState<string>('');

  const settleMutation = useSettleMatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!winner) {
      toast.error('Please select a winner');
      return;
    }

    try {
      await settleMutation.mutateAsync({
        matchId: match.id,
        winner,
      });

      toast.success('Match settled successfully');
      setWinner('');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to settle match');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Trophy className="mr-2 h-4 w-4" />
          Settle Match
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle Match</DialogTitle>
          <DialogDescription>
            Select the winning team to finalize the match and calculate the final P/L.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="winner">Winner</Label>
              <Select value={winner} onValueChange={setWinner}>
                <SelectTrigger id="winner">
                  <SelectValue placeholder="Select winning team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={match.team1}>{match.team1}</SelectItem>
                  <SelectItem value={match.team2}>{match.team2}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Once settled, you will not be able to add more entries to this match.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={settleMutation.isPending}>
              {settleMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Settling...
                </>
              ) : (
                'Settle Match'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
