import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAddEntry } from '../api';
import { toast } from 'sonner';
import { Match, EntryType } from '@/backend';

interface EntryFormCardProps {
  match: Match;
}

export default function EntryFormCard({ match }: EntryFormCardProps) {
  const [favoriteTeam, setFavoriteTeam] = useState<string>('');
  const [entryType, setEntryType] = useState<'back' | 'lay'>('back');
  const [rate, setRate] = useState('');
  const [amount, setAmount] = useState('');
  const [bookieName, setBookieName] = useState('');

  const addEntryMutation = useAddEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!favoriteTeam) {
      toast.error('Please select a favorite team');
      return;
    }

    const rateNum = parseFloat(rate);
    const amountNum = parseFloat(amount);

    if (isNaN(rateNum) || rateNum <= 0) {
      toast.error('Please enter a valid rate greater than 0');
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid bet amount greater than 0');
      return;
    }

    if (!bookieName.trim()) {
      toast.error('Please enter a bookie name');
      return;
    }

    try {
      await addEntryMutation.mutateAsync({
        matchId: match.id,
        favoriteTeam,
        entryType: entryType === 'back' ? EntryType.back : EntryType.lay,
        rate: rateNum,
        amount: amountNum,
        bookieName: bookieName.trim(),
      });

      toast.success('Entry added successfully');
      
      // Reset form
      setFavoriteTeam('');
      setEntryType('back');
      setRate('');
      setAmount('');
      setBookieName('');
    } catch (error) {
      toast.error('Failed to add entry');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Betting Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="favoriteTeam">Favorite Team</Label>
              <Select value={favoriteTeam} onValueChange={setFavoriteTeam}>
                <SelectTrigger id="favoriteTeam">
                  <SelectValue placeholder="Select favorite team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={match.team1}>{match.team1}</SelectItem>
                  <SelectItem value={match.team2}>{match.team2}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryType">Back / Lay</Label>
              <Select value={entryType} onValueChange={(val) => setEntryType(val as 'back' | 'lay')}>
                <SelectTrigger id="entryType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="back">Back</SelectItem>
                  <SelectItem value="lay">Lay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate">Rate</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g., 1.40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Bet Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 10000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookieName">Bookie Name</Label>
            <Input
              id="bookieName"
              value={bookieName}
              onChange={(e) => setBookieName(e.target.value)}
              placeholder="e.g., srk777"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={addEntryMutation.isPending}>
            {addEntryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Entry...
              </>
            ) : (
              'Add Entry'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
