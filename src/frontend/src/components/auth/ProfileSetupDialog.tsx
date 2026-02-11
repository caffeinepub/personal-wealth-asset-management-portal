import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/backend';

export default function ProfileSetupDialog() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  const { data: userProfile, isLoading: profileLoading, isFetched } = useQuery<UserProfile | null>({
    queryKey: queryKeys.userProfile.current(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.current() });
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await saveMutation.mutateAsync({ name: name.trim() });
    }
  };

  const showDialog = !!actor && !actorFetching && !profileLoading && isFetched && userProfile === null;

  return (
    <Dialog open={showDialog}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Your Wealth Portal</DialogTitle>
          <DialogDescription>
            Please enter your name to personalize your experience
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveMutation.isPending || !name.trim()}>
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
