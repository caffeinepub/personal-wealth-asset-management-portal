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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { useCreateMatch } from '../api';
import { toast } from 'sonner';
import { getStorageErrorMessage, logStorageError } from '@/utils/storageErrors';

export default function CreateMatchDialog() {
  const [open, setOpen] = useState(false);
  const [matchName, setMatchName] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  const createMutation = useCreateMatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!matchName.trim() || !team1.trim() || !team2.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (team1.trim().toLowerCase() === team2.trim().toLowerCase()) {
      toast.error('Team names must be different');
      return;
    }

    try {
      await createMutation.mutateAsync({
        matchName: matchName.trim(),
        team1: team1.trim(),
        team2: team2.trim(),
      });

      toast.success('Match created successfully');
      setMatchName('');
      setTeam1('');
      setTeam2('');
      setOpen(false);
    } catch (error) {
      logStorageError('create match', error);
      const errorMessage = getStorageErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Match
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Match</DialogTitle>
          <DialogDescription>
            Enter the match details and team names to start tracking betting entries.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="matchName">Match Name</Label>
              <Input
                id="matchName"
                value={matchName}
                onChange={(e) => setMatchName(e.target.value)}
                placeholder="e.g., India vs Australia"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team1">Team 1</Label>
              <Input
                id="team1"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
                placeholder="e.g., India"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team2">Team 2</Label>
              <Input
                id="team2"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
                placeholder="e.g., Australia"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Match'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
